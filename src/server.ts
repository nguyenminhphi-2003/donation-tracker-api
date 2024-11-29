import express, { Express } from 'express';
import app from './app';

const port = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Listening on port:${process.env.PORT}...`);
});
