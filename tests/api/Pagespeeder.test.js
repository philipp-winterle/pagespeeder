import { jest } from "@jest/globals";
import PageSpeeder from "../../Pagespeeder.js";

describe("PageSpeeder", () => {
  test("Initialize PageSpeeder with all parameters", () => {
    const url = "https://example.com";
    const device = "desktop";
    const runCount = 3;
    const options = {
      browserOptions: {
        port: 8080,
        host: "localhost",
        browserWSEndpoint: "ws://localhost:8080/devtools/browser",
      },
      silent: true,
      hooks: {
        beforeRunDevice: jest.fn(),
        afterRunDevice: jest.fn(),
        beforeRunIteration: jest.fn(),
        afterRunInteration: jest.fn(),
      },
    };
    const pageSpeeder = new PageSpeeder(url, device, runCount, options);
    expect(pageSpeeder.url).toBe(url);
    expect(pageSpeeder.devices).toEqual([device]);
    expect(pageSpeeder.runCount).toBe(runCount);
    expect(pageSpeeder.options).toEqual(options);
  });

  test("normalizeScores averages numeric audits and skips non-numeric ones", () => {
    const pageSpeeder = new PageSpeeder("https://example.com");
    const scores = [
      {
        score: 0.8,
        audits: [
          [
            "first-contentful-paint",
            {
              title: "First Contentful Paint",
              score: 0.9,
              numericValue: 1000,
              numericUnit: "millisecond",
            },
          ],
          [
            "screenshot-thumbnails",
            {
              title: "Screenshot Thumbnails",
              score: 1,
              numericValue: null,
              numericUnit: "unitless",
            },
          ],
        ],
      },
      {
        score: 0.6,
        audits: [
          [
            "first-contentful-paint",
            {
              title: "First Contentful Paint",
              score: 0.7,
              numericValue: 2000,
              numericUnit: "millisecond",
            },
          ],
        ],
      },
    ];

    const normalized = pageSpeeder.normalizeScores(scores);

    expect(normalized.mainScore).toBe(70);
    expect(normalized.auditScores["First Contentful Paint"]).toEqual({
      score: 80,
      value: 1500,
      unit: "millisecond",
      displayValue: "1.5s",
    });
    expect(normalized.auditScores["Screenshot Thumbnails"]).toBeUndefined();
  });

  test("getDeviceConfig returns configs for known devices", () => {
    expect(PageSpeeder.getDeviceConfig(PageSpeeder.DEVICE_MOBILE)).toBeDefined();
    expect(
      PageSpeeder.getDeviceConfig(PageSpeeder.DEVICE_DESKTOP)
    ).toBeDefined();
  });

  test("getDeviceConfig throws for unknown device", () => {
    expect(() => PageSpeeder.getDeviceConfig("tablet")).toThrow(
      "Can not get lighthouse config for device tablet"
    );
  });
});
