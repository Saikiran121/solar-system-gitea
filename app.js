const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const serverless = require('serverless-http');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// connect to MongoDB using modern Promise style
mongoose
  .connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD
  })
  .then(() => {
    console.log('MongoDB Connection Successful');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// POST /planet - find planet by id
app.post('/planet', async (req, res, next) => {
  try {
    const id = req.body.id;

    // basic validation
    if (id === undefined || id === null) {
      return res.status(400).json({ error: 'Missing planet id in request body' });
    }

    const planetData = await planetModel.findOne({ id: id });

    if (!planetData) {
      // If you expect 0-9, you can return a helpful message
      return res.status(404).json({ error: 'Planet not found. Choose id between 0-9.' });
    }

    return res.json(planetData);
  } catch (err) {
    // pass to error handler / log
    console.error('Error fetching planet:', err);
    return next(err);
  }
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
  fs.readFile('oas.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }
    res.json(JSON.parse(data));
  });
});

app.get('/os', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    os: OS.hostname(),
    env: process.env.NODE_ENV
  });
});

app.get('/live', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ status: 'live' });
});

app.get('/ready', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ status: 'ready' });
});

// basic express error handler (so tests get meaningful responses)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  // only start server when run directly (not when required by tests)
  app.listen(3000, () => {
    console.log('Server successfully running on port - 3000');
  });
}

module.exports = app;
// module.exports.handler = serverless(app)

