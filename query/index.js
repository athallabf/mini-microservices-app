const express = require('express');
const cors = require('cors');
const axios = require('axios');

//?-------Variables
const app = express();
const port = 4002;
const posts = {};
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, status, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === 'CommentUpdated') {
    const { id, content, status, postId } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

//?-------Middlewares
app.use(cors());
app.use(express.json());

//?-------Handlers
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(port, async () => {
  console.log(`Server running on localhost:${port}`);

  const res = await axios
    .get('http://localhost:4005/events')
    .catch((err) => console.log(err));

  console.log(res.data);
  for (let event of res.data) {
    console.log(`Processing Event: ${event.type}`);

    handleEvent(event.type, event.data);
  }
});
