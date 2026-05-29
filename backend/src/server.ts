import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 Bloginn API Server running on port ${PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled rejection:', err.message);
  process.exit(1);
});
