// Jest manual mock for @plone/client (auto-applied for this node module).
//
// The real package's CJS build pulls in ESM-only `query-string`, which Jest's
// CJS runtime can't load. The filemanager mocks the client at its own api/
// boundary (src/api/ploneClient.js), so no test needs the real implementation —
// it is exercised by the webpack build and manual smoke instead. Individual
// tests may still `jest.mock("@plone/client", …)` to assert on `initialize`.
module.exports = {
    __esModule: true,
    default: { initialize: () => ({}) },
};
