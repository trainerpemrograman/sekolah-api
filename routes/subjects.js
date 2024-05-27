// routes/subjects.js
const http = require('http');
const url = require('url');
const connectToDb = require('../db/connection');

const getSubjects = async (req, res) => {
  const db = await connectToDb();
  const subjects = await db.collection('mata_pelajaran').find().toArray();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(subjects));
};

const addSubject = async (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    const subject = JSON.parse(body);
    const db = await connectToDb();
    await db.collection('mata_pelajaran').insertOne(subject);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(subject));
  });
};

const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/subjects' && req.method === 'GET') {
    return getSubjects(req, res);
  } else if (parsedUrl.pathname === '/subjects' && req.method === 'POST') {
    return addSubject(req, res);
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
};

module.exports = requestHandler;
