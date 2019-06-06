const multer = require('multer');
const express = require('express');
const { exec } = require('child_process');

const server = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: `${__dirname}/../uploads/` });

server.use(express.static('public'));
server.post('/audios', upload.single('audio'), (req, res) => {
  if (!req.file) return res.send(401, { message: 'File required' });

  const command = `ffmpeg -i ${req.file.path} -n ${req.file.path}.wav`;
  exec(command, (error) => console.log(error ? error : 'Audio transform completed'));
  res.json({ message: req.file });
});

server.listen(port, () => console.info(`Server is up on port ${port}`));
