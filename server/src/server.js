import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Load the app only after environment variables are available to CORS and route configuration.
const { default: app } = await import('./app.js');
const PORT = process.env.PORT || 5000;

export const startServer = () => app.listen(PORT, () => {
  console.log(`[SERVER] API berjalan di port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});

if (process.env.NODE_ENV !== 'test') startServer();

export default app;
