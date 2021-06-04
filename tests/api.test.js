jest.setTimeout(10000);
const PageSpeeder = require("../Pagespeeder");
let scores = null;

beforeAll(async () => {
  const ps = new PageSpeeder("https://github.com/hummal/pagespeeder", "mobile");
  scores = await ps.run();
});

describe("pagespeeder execution", () => {
  test("pagespeeder result check", () => {
    expect(Array.isArray(scores)).toBeTruthy();
  });

  test("pagespeeder result array has more then 0 entries", () => {
    expect(scores.length).toBeGreaterThan(0);
  });

  test("scores contain device key and is mobile", () => {
    const mobileScore = scores[0];
    expect(mobileScore.device).toBe("mobile");
  });

  test("scores contain score key and is object", () => {
    const mobileScore = scores[0];
    expect(typeof mobileScore.score).toBe("object");
  });

  test("score obj contain actually scores", () => {
    const mobileScore = scores[0];
    const mainScore = mobileScore.score.mainScore;
    expect(mainScore).toBeGreaterThan(0);
  });

  test("Auditscores contain core keys", () => {
    const mobileScore = scores[0];
    const audits = mobileScore.score.auditScores;
    const expectedAuditKeys = [
      "First Contentful Paint",
      "Speed Index",
      "Largest Contentful Paint",
      "Time to Interactive",
      "Total Blocking Time",
      "Cumulative Layout Shift",
      "First Meaningful Paint",
    ];
    expect(Object.keys(audits)).toEqual(
      expect.arrayContaining(expectedAuditKeys)
    );
  });

  test("Speed Index Audit contains 4 keys", () => {
    const mobileScore = scores[0];
    const audits = mobileScore.score.auditScores;
    const testAudit = audits["Speed Index"];
    const expectedAuditKeys = ["score", "value", "unit", "displayValue"];
    expect(Object.keys(testAudit)).toEqual(
      expect.arrayContaining(expectedAuditKeys)
    );
  });
});
