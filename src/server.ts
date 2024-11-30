import app from './app';
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;

const DB: string = process.env.DATABASE_URL!.replace(
  '<db_username>',
  process.env.DATABASE_NAME!,
).replace('<db_password>', process.env.DATABASE_PASSWORD!);

mongoose.connect(DB).then(() => console.log('Database connection successful!'));

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
