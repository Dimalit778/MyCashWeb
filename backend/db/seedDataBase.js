import * as fs from "fs";
import * as path from "path";

export const seedDatabase = () => {
  const testSeed = JSON.parse(fs.readFileSync(path.join(process.cwd(), "db", "database-seed.json"), "utf-8"));

  // seed database with test data
  db.setState(testSeed).write();
  return;
};
