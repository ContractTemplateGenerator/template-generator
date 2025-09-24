import { createApp } from './index';

const port = process.env.PORT || 4000;
const app = createApp();

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
