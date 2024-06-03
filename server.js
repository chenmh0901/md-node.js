// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/notes', (req, res) => {
  fs.readdir(path.join(__dirname, 'articles'), (err, files) => {
    if (err) {
      res.status(500).send('Server Error');
    } else {
      res.json(files.filter(file => file.endsWith('.md')));
    }
  });
});

app.get('/notes/:articleName', (req, res) => {
  fs.readFile(path.join(__dirname, 'articles', req.params.articleName), 'utf8', (err, data) => {
    if (err) {
      res.status(404).send('Not Found');
    } else {
      res.send(data);
    }
  });
});

app.listen(3001, () => console.log('Server is running on port 3001'));
