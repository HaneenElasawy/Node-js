const http = require("http");
const fs = require("fs");
const path = require("path");
const {readInventory } = require("../Lab1/index.js");

const imagesContentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let stream;
  if (req.url === "/") {
    const inventory = readInventory();
    if (!inventory) {
      console.log("The inventory does not exist or invalid.");
      return;
    }

    if (inventory.length === 0) {
      console.log("The inventory is empty");
      return;
    }

      const items = inventory.map((item) => {
      return `<div>
      <ul> <h3> ${item.name} </h3>
      <li>Quantity: ${item.quantity}</li>
      <li>Category: ${item.category}</li>      
    </ul>
    </div>

`}).join('')

   const HomePage = buildHome(items);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(HomePage)
    return
  } else if (req.url === "/astronomy") {
    stream = fs.createReadStream("pages/astronomy.html");
    res.writeHead(200, { "Content-Type": "text/html" });
  } else if (req.url === "/serbal") {
    stream = fs.createReadStream("pages/serbal.html");
    res.writeHead(200, { "Content-Type": "text/html" });
  } else if (req.url === "/styles/styles.css") {
    stream = fs.createReadStream("styles/styles.css");
    res.writeHead(200, { "Content-Type": "text/css" });
  } else if (req.url.startsWith("/images/")) {
    const filePath = "." + req.url; //./images/file.jpg
    const ext = path.extname(filePath);
    const contentType = imagesContentTypes[ext] || "application/octet-stream";
    stream = fs.createReadStream(filePath);
    res.writeHead(200, { "Content-Type": contentType });
  } else {
    stream = fs.createReadStream("pages/404.html");
    res.writeHead(404, { "Content-Type": "text/html" });
  }

  stream.pipe(res);
});

server.listen(3000);

function buildHome (itemsHtml){
    return `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/styles/styles.css">
</head>
<body>
    <h1>Available inventory</h1>
    ${itemsHtml}
</body>
</html>
`
}