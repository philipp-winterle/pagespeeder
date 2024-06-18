import PageSpeeder from "../Pagespeeder.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async () => {
  console.info("\nSetup Jest for Pagespeeder Tests");
  const ps = new PageSpeeder("https://github.com/", "mobile", 1);
  const scores = await ps.run();

  await fs.writeFile(
    path.join(__dirname, "results", "test-results.json"),
    JSON.stringify(scores, null, 2),
    { flag: "w+", encoding: "utf-8" }
  );
};
