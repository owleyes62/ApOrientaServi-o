import "dotenv/config";
import express from 'express';

const app = express();

app.get('/hello_world', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () =>
  console.log('Example app listening on port 3000!\n' + process.env.MESSAGE),
);