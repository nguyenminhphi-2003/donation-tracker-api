import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'dotenv/config';
import { MainRouter } from './routes';
import AppError from './utilities/appError';
import errorController from './controllers/error.controller';

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', MainRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

export default app;
