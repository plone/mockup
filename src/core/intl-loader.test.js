import { ensureIntlSupport } from "./intl-loader";

describe("intl-loader", () => {
    let originalDateTimeFormat;

    beforeAll(() => {
        originalDateTimeFormat = Intl.DateTimeFormat;
        jest.spyOn(console, "info").mockImplementation(() => {});
        jest.spyOn(console, "warn").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
        Intl.DateTimeFormat = originalDateTimeFormat;
        console.info.mockRestore();
        console.warn.mockRestore();
        console.error.mockRestore();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset to original before each test to have a clean state
        // Note: some polyfill effects might persist if they touch other global objects
        Intl.DateTimeFormat = originalDateTimeFormat;
    });

    it("should detect supported locales correctly", async () => {
        // 'en' should be supported
        await ensureIntlSupport("en");
        expect(console.info).not.toHaveBeenCalledWith(expect.stringContaining("not supported"));
    });

    it("should handle locale normalization", async () => {
        await ensureIntlSupport("pt_BR");
        // pt-BR is likely supported, but we just check it doesn't crash
    });

    it("should load polyfill and provide Basque (eu) formatting", async () => {
        // We force a mock that says 'eu' is NOT supported
        const mockSupportedLocalesOf = jest.fn().mockImplementation((locales) => {
            const l = Array.isArray(locales) ? locales[0] : locales;
            if (l.startsWith('eu')) return [];
            return originalDateTimeFormat.supportedLocalesOf(locales);
        });
        
        // We need to mock the property because it might be a getter
        Object.defineProperty(Intl, 'DateTimeFormat', {
            value: class extends originalDateTimeFormat {
                static supportedLocalesOf = mockSupportedLocalesOf;
            },
            configurable: true
        });

        await ensureIntlSupport("eu");

        expect(mockSupportedLocalesOf).toHaveBeenCalled();
        expect(console.info).toHaveBeenCalledWith(expect.stringContaining("not supported"));

        // After ensureIntlSupport, Intl.DateTimeFormat should have been replaced by the polyfill
        // since we used polyfill-force.js (or at least it was called).
        
        // Verify formatting using UTC to avoid timezone shifts
        const date = new Date(Date.UTC(2020, 5, 1)); // June 1st UTC
        const dtf = new Intl.DateTimeFormat("eu", { month: "short", timeZone: "UTC" });
        const formatted = dtf.format(date);
        
        // Basque short month for June is 'eka.'
        expect(formatted.toLowerCase()).toContain("eka");
    });
});
