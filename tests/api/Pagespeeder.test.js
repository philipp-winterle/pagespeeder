import { jest } from "@jest/globals";
import PageSpeeder from "../../Pagespeeder.js";

describe("PageSpeeder", () => {
  test("Initialize PageSpeeder with all parameters", () => {
    class PageSpeederTest {
      testInitializePageSpeeder() {
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
      }
    }

    const pageSpeederTest = new PageSpeederTest();
    pageSpeederTest.testInitializePageSpeeder();
  });
});
