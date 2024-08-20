import { Client, Pool } from 'pg';

const connectionConfig = {
  user: process.env.DB_USER || 'shade',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shade',
  password: process.env.DB_PASSWORD || 'shade',
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

export const pool = new Pool({
  ...connectionConfig,
});

export const createClient = () =>
  new Client({
    ...connectionConfig,
  });

const handleSignalExit: NodeJS.SignalsListener = async (signal) => {
  console.log(`Received ${signal}. Closing PostgreSQL pool and exiting.`);
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', handleSignalExit);
process.on('SIGTERM', handleSignalExit);
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await pool.end();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await pool.end();
  process.exit(1);
});
// export const listenMessages = (
//   channelName: string,
//   callback: (channel: string, payload: string | undefined) => void
// ) => {
//   const client = createClient();
//   client.connect();
//   client.on('notification', (notification: Notification) => {
//     const { channel, payload } = notification;
//     console.log(`Received notification on channel ${channel}: ${payload}`);
//     callback(channel, payload);
//   });
//   client.query(`LISTEN ${channelName}`);
// };

export default pool;
