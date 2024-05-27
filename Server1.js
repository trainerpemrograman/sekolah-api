const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Sistem_informasi_Akademik';

const client = new MongoClient(url, { useUnifiedTopology: true });

const port = 3000;

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const reqUrl = req.url;

  await client.connect();
  const db = client.db(dbName);

  if (reqUrl === '/mata-pelajaran' && method === 'GET') {
    const collection = db.collection('Mata_Pelajaran');
    const mataPelajaran = await collection.find({}).toArray();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mataPelajaran));
  } else if (reqUrl.startsWith('/mata-pelajaran/id/') && method === 'GET') {
    const id = reqUrl.split('/')[3];
    try {
      const collection = db.collection('Mata_Pelajaran');
      const mataPelajaran = await collection.findOne({ _id: ObjectId(id) });
      if (mataPelajaran) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mataPelajaran));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Mata Pelajaran not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid ID format' }));
    }
  } else if (reqUrl.startsWith('/mata-pelajaran/kode/') && method === 'GET') {
    const kodeMapel = reqUrl.split('/')[3];
    const collection = db.collection('Mata_Pelajaran');
    const mataPelajaran = await collection.findOne({ kode_mapel: kodeMapel });
    if (mataPelajaran) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mataPelajaran));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Mata Pelajaran not found' }));
    }
  } else if (reqUrl === '/mata-pelajaran' && method === 'POST') {
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
  } else if (reqUrl.startsWith('/mata-pelajaran/') && method === 'PUT') {
    const id = reqUrl.split('/')[2];
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
  } else if (reqUrl.startsWith('/mata-pelajaran/') && method === 'DELETE') {
    const id = reqUrl.split('/')[2];
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
