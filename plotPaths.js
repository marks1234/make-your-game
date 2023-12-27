import fs from "fs/promises";

const obj = {};
export default async function createPathsObj(startingPath) {
  const files = (await fs.readdir(startingPath)).filter((name) => {
    switch (true) {
      case name.includes(".md"):
        return false;
      case name.includes(".json"):
        return false;
      case name[0] == ".":
        return false;
      case name == "node_modules":
        return false;
      default:
        return true;
    }
  });

  files.forEach((value) => {
    obj[value] = true;
  });

  console.log(files);
}
