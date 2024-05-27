const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Sistem_informasi_Akademik';

const client = new MongoClient(url, { useUnifiedTopology: true });

const port = 3000;

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const url = req.url;
  
  await client.connect();
  const db = client.db(dbName);
  
  if (url === '/mata-pelajaran' && method === 'GET') {
    const collection = db.collection('Mata_Pelajaran');
    const mataPelajaran = await collection.find({}).toArray();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mataPelajaran));
  } else if (url.startsWith('/mata-pelajaran/') && method === 'GET') {
    const id = url.split('/')[2];
    const collection = db.collection('Mata_Pelajaran');
    const mataPelajaran = await collection.findOne({ _id: ObjectId(id) });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mataPelajaran));
  } else if (url === '/mata-pelajaran' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const newMataPelajaran = JSON.parse(body);
      const collection = db.collection('Mata_Pelajaran');
      await collection.insertOne(newMataPelajaran);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newMataPelajaran));
    });
  } else if (url.startsWith('/mata-pelajaran/') && method === 'PUT') {
    const id = url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const updatedMataPelajaran = JSON.parse(body);
      const collection = db.collection('Mata_Pelajaran');
      await collection.updateOne({ _id: ObjectId(id) }, { $set: updatedMataPelajaran });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedMataPelajaran));
    });
  } else if (url.startsWith('/mata-pelajaran/') && method === 'DELETE') {
    const id = url.split('/')[2];
    const collection = db.collection('Mata_Pelajaran');
    await collection.deleteOne({ _id: ObjectId(id) });
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
