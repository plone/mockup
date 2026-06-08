import logger from "@patternslib/patternslib/src/core/logging";
import { request } from "./client.js";

const log = logger.getLogger("pat-filemanager");

// File upload against plone.restapi. Primary path is the resumable @tus-upload
// service (POST to create the upload, then chunked PATCH of the bytes); a plain
// content POST (base64-encoded primary field) is the fallback for when tus is
// unavailable. See spec §3 and plone.restapi services/content/tus.py.

const TUS_VERSION = "1.0.0";
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024;

/** Base64-encode a (UTF-8) string for the Tus Upload-Metadata header. */
function b64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (const byte of bytes) bin += String.fromCharCode(byte);
    return btoa(bin);
}

/** Build the comma-separated `key b64(value)` Upload-Metadata header value. */
function encodeMetadata(meta) {
    return Object.entries(meta)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${key} ${b64(String(value))}`)
        .join(",");
}

/**
 * Upload one file into a folder via the resumable @tus-upload service.
 *
 * POSTs to `{folderUrl}/@tus-upload` to open an upload (the new resource url
 * comes back in the `Location` header), then PATCHes the bytes in chunks until
 * the server reports the full length. The created object's url is returned from
 * the final PATCH `Location` header.
 *
 * @param {string} folderUrl - container the file is added to
 * @param {File} file
 * @param {object} [opts]
 * @param {(loaded:number, total:number) => void} [opts.onProgress]
 * @param {number} [opts.chunkSize]
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<string|null>} created object url, if the server reported one
 */
export async function uploadFileTus(folderUrl, file, opts = {}) {
    const { onProgress, chunkSize = DEFAULT_CHUNK_SIZE, signal } = opts;

    const metadata = encodeMetadata({
        filename: file.name,
        "content-type": file.type || "application/octet-stream",
    });

    log.debug(`tus POST ${folderUrl}/@tus-upload (${file.size} bytes)`);
    const createResponse = await fetch(`${folderUrl}/@tus-upload`, {
        method: "POST",
        credentials: "same-origin",
        signal,
        headers: {
            Accept: "application/json",
            "Tus-Resumable": TUS_VERSION,
            "Upload-Length": String(file.size),
            "Upload-Metadata": metadata,
        },
    });
    if (!createResponse.ok) {
        throw new Error(
            `Could not start upload of ${file.name} (status ${createResponse.status})`
        );
    }
    const location = createResponse.headers.get("Location");
    if (!location) {
        throw new Error(`Upload of ${file.name} returned no Location header`);
    }

    let offset = 0;
    let createdUrl = null;
    while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        const patchResponse = await fetch(location, {
            method: "PATCH",
            credentials: "same-origin",
            signal,
            headers: {
                Accept: "application/json",
                "Tus-Resumable": TUS_VERSION,
                "Upload-Offset": String(offset),
                "Content-Type": "application/offset+octet-stream",
            },
            body: chunk,
        });
        if (!patchResponse.ok) {
            throw new Error(
                `Upload of ${file.name} failed at offset ${offset} (status ${patchResponse.status})`
            );
        }
        const next = Number(patchResponse.headers.get("Upload-Offset"));
        // Trust the server's reported offset, but never go backwards.
        offset = Number.isFinite(next) && next > offset ? next : offset + chunk.size;
        if (onProgress) onProgress(Math.min(offset, file.size), file.size);
        createdUrl = patchResponse.headers.get("Location") || createdUrl;
    }

    return createdUrl;
}

/** Read a File as a bare base64 string (no data: prefix). */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || "");
            resolve(result.slice(result.indexOf(",") + 1));
        };
        reader.onerror = () => reject(reader.error || new Error("File read failed"));
        reader.readAsDataURL(file);
    });
}

/**
 * Fallback: create the content with a single JSON POST, sending the file as a
 * base64 primary field. Images go to an Image, everything else to a File.
 */
export async function uploadFilePost(folderUrl, file) {
    const isImage = (file.type || "").startsWith("image/");
    const type = isImage ? "Image" : "File";
    const field = isImage ? "image" : "file";
    const data = await fileToBase64(file);
    log.debug(`POST ${folderUrl} (${type} fallback for ${file.name})`);
    return request(folderUrl, {
        method: "POST",
        body: {
            "@type": type,
            title: file.name,
            [field]: {
                data,
                encoding: "base64",
                filename: file.name,
                "content-type": file.type || "application/octet-stream",
            },
        },
    });
}

/**
 * Create an (empty) folderish container inside `parentUrl` via a stock content
 * POST. `type` is the portal type to create (default "Folder"); restapi derives
 * the id from the title. Returns the created object — its `@id` is the url
 * children get added to.
 *
 * @param {string} parentUrl - container the folder is created in
 * @param {object} opts
 * @param {string} opts.title - folder title (and id source)
 * @param {string} [opts.type="Folder"] - portal type of the created container
 * @returns {Promise<{"@id":string}>}
 */
export function createFolder(parentUrl, { title, type = "Folder" } = {}) {
    log.debug(`POST ${parentUrl} (create ${type} "${title}")`);
    return request(parentUrl, {
        method: "POST",
        body: { "@type": type, title },
    });
}

/**
 * Upload one file, preferring resumable tus and falling back to a plain content
 * POST if tus is unavailable. A failed tus attempt creates no content (the
 * object is only added once the final chunk lands), so the fallback is safe.
 */
export async function uploadFile(folderUrl, file, opts = {}) {
    try {
        return await uploadFileTus(folderUrl, file, opts);
    } catch (error) {
        log.debug(`tus upload failed, falling back to POST: ${error.message}`);
        return uploadFilePost(folderUrl, file);
    }
}
