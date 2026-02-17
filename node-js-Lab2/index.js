const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('./pages/home.html').pipe(res);
  }

  else if (req.method === 'GET' && req.url === '/astronomy') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('./pages/astronomy.html').pipe(res);
  }

  else if (req.method === 'GET' && req.url === '/serbal') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('./pages/serbal.html').pipe(res);
  }

  else if (req.method === 'GET' && req.url === '/styles.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    fs.createReadStream('./public/styles.css').pipe(res);
  }

  else if (req.method === 'GET' && req.url === '/astronomy.jpg') {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    fs.createReadStream('./public/astronomy.jpg').pipe(res);
  }

  else if (req.method === 'GET' && req.url === '/serbal.jpeg') {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    fs.createReadStream('./public/serbal.jpeg').pipe(res);
  }

  else if (req.method === 'GET' && req.url === '/astronomy/download') {
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'attachment; filename="astronomy.jpg"'
    });
    fs.createReadStream('./public/astronomy.jpg').pipe(res);
  }

  else if (req.method === 'POST' && req.url === '/inventory') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const newItem = JSON.parse(body);
        const fileData = fs.readFileSync('./inventory.json', 'utf-8');
        const inventory = JSON.parse(fileData);
        inventory.push(newItem);
        fs.writeFileSync('./inventory.json', JSON.stringify(inventory, null, 2));
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item added successfully' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON body' }));
      }
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    fs.createReadStream('./pages/404.html').pipe(res);
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
