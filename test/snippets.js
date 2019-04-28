import yuml2svg from "../index.mjs";
import { promises as fs } from "fs";
import { dirname, join } from "path";

const __dirname = dirname(new URL(import.meta.url).pathname);

const inputFile = join(__dirname, "snippets.json");

export default fs
  .readFile(inputFile)
  .then(JSON.parse)
  .then(Object.entries)
  .then(snippets =>
    Promise.all(
      snippets.map(([name, { body }]) =>
        yuml2svg(body.join("\n"))
          .then(svg => fs.writeFile(join(__dirname, name + ".svg"), svg))
          .catch(e => {
            e.cause = "snippet: " + name;
            return Promise.reject(e);
          })
      )
    )
  );
