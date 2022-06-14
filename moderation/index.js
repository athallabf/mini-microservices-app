const express = require('express');
const axios = require('axios');

//?-------Variables
const app = express();
const port = 4003;
const eventEndpoint = 'http://localhost:4005/events';

//?-------Middlewares
app.use(express.json());

//?-------Handlers
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post(eventEndpoint, {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        content: data.content,
        status,
      },
    });
  }
  res.send({});
});

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
