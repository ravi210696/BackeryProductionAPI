import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {rateLimit} from 'express-rate-limit';
import morgan from 'morgan';
import {logger,logRequestIp} from './helper/logger.js';
import {errors} from 'celebrate';
import fileUpload from 'express-fileupload';
import routes from './routes/apiRoutes.js';


dotenv.config();
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload());
app.disable('etag');

const limiter=rateLimit({
     windowMs:1 * 60 * 1000,
     max:100,
     message:'Too many requests from this ip,please try again later'
})

app.use(limiter);
app.use(logRequestIp);
app.use(morgan('dev',{stream:logger.stream}));


//Routes
app.use('/api/production',routes);
app.use(errors());
app.use((err,request,response,next)=>{
     console.log(err.details)
     let resObj={}
     const error = err.stack ? err.stack : err;
     const status = err.status ? err.status : 500;
     console.error("ERROR -> ", error);
     resObj = {
      success: false,
      description: err.message,
      message: "Service unavailable. please try again later",
      error,
    };

    response.status(status).json(resObj)
})

process.on('unCaughtException',(error)=>{
     logger.error("UNCAUGHT EXCEPTION",error)
     process.exit(1)
})

app.use((req, res) => {
  res.status(404).json({ error: 'No such API exists' });
});

const port=process.env.port || 8001
app.listen(port,()=>console.log(`Server running on port ${port}`));
