// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const app = express();

const notes = fs.readdirSync(path.join(__dirname, 'notes')).filter(file => file.endsWith('.md'));

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', (req, res) => {
  res.render('index', { notes });
});

app.get('/notes', (req, res) => {
  fs.readdir(path.join(__dirname, 'notes'), (err, files) => {
    if (err) {
      res.status(500).send('Server Error');
    } else {
      res.json(files.filter(file => file.endsWith('.md')));
    }
  });
});

app.get('/notes/:noteName', (req, res) => {
  fs.readFile(path.join(__dirname, 'notes', req.params.noteName), 'utf8', (err, data) => {
    if (err) {
      res.status(404).send('Not Found');
    } else {
      res.send(data);
    }
  });
});

app.post('/notes', (req, res, next) => {
  const form = new formidable.IncomingForm({ multiples: true, uploadDir: path.resolve(__dirname + '/notes'), keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const oldPath = path.join(form.uploadDir, files.portrait[0].newFilename);
    const newPath = path.join(form.uploadDir, files.portrait[0].originalFilename);
    console.log(oldPath, newPath);
    fs.rename(oldPath, newPath, err => {
      if (err) {
        next(err);
        return;
      }

      console.log(files);
      const url = '/notes/' + files.portrait[0].originalFilename;
      res.send(url);
    });
  });
});

app.listen(3001, () => console.log('Server is running on port 3001'));

