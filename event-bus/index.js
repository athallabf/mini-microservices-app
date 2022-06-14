const express = require('express');
const axios = require('axios');

//?-------Variables
const app = express();
const port = 4005;
const postsEndpoint = 'http://localhost:4000/events';
const commentsEndpoint = 'http://localhost:4001/events';
const queryEndpoint = 'http://localhost:4002/events';
const events = [];

const modEndpoint = 'http://localhost:4003/events';
//?-------Middlewares
app.use(express.json());

//?-------Handlers
app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post(postsEndpoint, event).catch((err) => console.log(err.message));
  axios.post(commentsEndpoint, event).catch((err) => console.log(err.message));
  axios.post(queryEndpoint, event).catch((err) => console.log(err.message));
  axios.post(modEndpoint, event).catch((err) => console.log(err.message));

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(port, () => {
  console.log(`server running on localhost:${port}`);
});
