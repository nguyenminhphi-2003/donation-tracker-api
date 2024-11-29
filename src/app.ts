import express, { Express } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'dotenv/config';

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

export default app;
