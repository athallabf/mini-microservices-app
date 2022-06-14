const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

//?-----Variables
const app = express();
const port = 4001;
const commentsByPostId = {};
const postsEndpoint = 'http://localhost:4000/';
const commentsEndpoint = 'http://localhost:4001/';
const queryEndpoint = 'http://localhost:4002/';
const eventEndpoint = 'http://localhost:4005/events';

//?------Middleware
app.use(express.json());
app.use(cors());

//?-----Handlers
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  await axios.post(`${eventEndpoint}`, {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      status: 'pending',
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received Event ', req.body.type);
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, status, id, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    await axios.post(eventEndpoint, {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        status,
        postId,
      },
    });
  }

  res.send({});
});

app.listen(port, () => {
  console.log(`server running on localhost:${port}`);
});
