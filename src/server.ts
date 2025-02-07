import app from './app';
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;

if (!dbUrl || !dbUsername || !dbPassword) {
  console.error('Missing required environment variables:');
  if (!dbUrl) console.error('- DATABASE_URL');
  if (!dbUsername) console.error('- DATABASE_USERNAME');
  if (!dbPassword) console.error('- DATABASE_PASSWORD');
  process.exit(1);
}

const DB: string = dbUrl
  .replace('<db_username>', dbUsername)
  .replace('<db_password>', dbPassword);

mongoose.connect(DB).then(() => console.log('Database connection successful!'));

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});