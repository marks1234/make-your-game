import http from "http";
import imagefs from "fs";
import fs from "fs/promises";

const host = "localhost";
const port = 8000;

async function readFileIfExists(path) {
  if (path == "./") {
    // Check if the path exists
    const data = await fs.readFile("index.html", "utf8"); // Read the file
    return data;
  }
  try {
    await fs.access(path); // Check if the path exists
    const data = await fs.readFile(path, "utf8"); // Read the file
    return data; // Return the file contents
  } catch (error) {
    if (error.code === "ENOENT") {
      // The file does not exist
      return Error("404: File not found"); // Return a 404 error
    } else {
      // Other errors
      return error; // Rethrow other errors
    }
  }
}

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {
 *         req: http.IncomingMessage;
 *         }} res
 */
const requestListener = async function (req, res) {
  const fileType = req.url.split(".")[1];
  const data = await readFileIfExists("." + req.url);
  // console.log(fileType);
  // console.log(data);
  if (req.url == "/") {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(data);
    return;
  }

  if (data instanceof Error) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(
      JSON.stringify({
        error: "These are not the droids you are looking for...",
        actualError: data.message,
      })
    );
    return;
  }
  if (fileType == "jpg" || fileType.toLowerCase() == "png") {
    try {
      res.writeHead(200, { "Content-Type": "image/jpeg" });

      // Read the image and send it in the response
      const imagePath = "." + req.url; // Replace with your image path

      const imageStream = imagefs.createReadStream(imagePath);

      imageStream.pipe(res);
    } catch (err) {
      console.error(err);
      res.writeHead(501, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  try {
    switch (fileType) {
      case "js":
        res.setHeader("Content-Type", "application/javascript");
        break;
      case "json":
        res.setHeader("Content-Type", "application/json");
        break;
      case "css":
        res.setHeader("Content-Type", "text/css");
        break;
      case "html":
        res.setHeader("Content-Type", "text/html");
        break;
      default:
        throw Error("File type not applicable");
    }
    res.writeHead(200);
    res.end(data);
  } catch (err) {
    console.log(fileType);
    console.error(err);
    res.writeHead(501, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
