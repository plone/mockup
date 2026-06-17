import { formatDate, formatSize, isExpired, isIneffective } from "./format";

const NOW = new Date("2026-06-05T12:00:00Z");
const PAST = "2020-01-01T00:00:00+00:00";
const FUTURE = "2099-01-01T00:00:00+00:00";

describe("formatDate", () => {
    it("returns an empty string for catalog 'no date' sentinels", () => {
        expect(formatDate("1969/12/31 19:00:00 US/Eastern")).toBe("");
        expect(formatDate("None")).toBe("");
        expect(formatDate("")).toBe("");
        expect(formatDate(null)).toBe("");
    });

    it("formats a real date string", () => {
        expect(formatDate(PAST)).not.toBe("");
    });

    it("respects the document language (de)", () => {
        const originalLang = document.documentElement.lang;
        document.documentElement.lang = "de";
        const formatted = formatDate(PAST);
        // "Jan." is the short month in German for January (January 1st, 2020)
        expect(formatted).toContain("Jan.");
        document.documentElement.lang = originalLang;
    });

    it("respects the document language (en)", () => {
        const originalLang = document.documentElement.lang;
        document.documentElement.lang = "en";
        const formatted = formatDate(PAST);
        // "Jan" is the short month in English for January
        expect(formatted).toContain("Jan");
        document.documentElement.lang = originalLang;
    });
});

describe("formatSize", () => {
    it("scales bytes into human units", () => {
        expect(formatSize(0)).toBe("0 B");
        expect(formatSize(2048)).toBe("2.0 KB");
    });
});

describe("isIneffective", () => {
    it("is true when the effective date is in the future", () => {
        expect(isIneffective({ EffectiveDate: FUTURE }, NOW)).toBe(true);
    });

    it("is false when the effective date has passed", () => {
        expect(isIneffective({ EffectiveDate: PAST }, NOW)).toBe(false);
    });

    it("is false when no effective date is set", () => {
        expect(isIneffective({ EffectiveDate: "None" }, NOW)).toBe(false);
        expect(isIneffective({}, NOW)).toBe(false);
        expect(isIneffective({ EffectiveDate: "1969/12/31" }, NOW)).toBe(false);
    });
});

describe("isExpired", () => {
    it("is true when the expiration date has passed", () => {
        expect(isExpired({ ExpirationDate: PAST }, NOW)).toBe(true);
    });

    it("is false when the expiration date is still in the future", () => {
        expect(isExpired({ ExpirationDate: FUTURE }, NOW)).toBe(false);
    });

    it("is false when no expiration date is set", () => {
        expect(isExpired({ ExpirationDate: "None" }, NOW)).toBe(false);
        expect(isExpired({}, NOW)).toBe(false);
    });
});
