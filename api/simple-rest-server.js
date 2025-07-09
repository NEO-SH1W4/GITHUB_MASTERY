import express from 'express';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Simple REST server running on port ${PORT}`);
});
