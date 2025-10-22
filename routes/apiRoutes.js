import express from 'express';
import authPath from './auth.js';
const app=express();

app.use('/auth',authPath);

export default app;