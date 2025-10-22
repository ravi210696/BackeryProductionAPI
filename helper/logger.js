import DailyRotateFile from 'winston-daily-rotate-file';
import winston from 'winston';
import fs from 'fs';

const env = process.env.STAGE || 'development';
const logDir='log';

let level = env === 'development' ? 'debug' : 'info';

if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir)
}

const colorizer = winston.format.colorize();

const myFormat = (msg) => `${msg.timestamp}-[${msg.level.toUppercase()}] ; ${msg.stack ? msg.stack : ''}`;

const logger= winston.createLogger({
    format : winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf((msg=>myFormat(msg)))
    ),
    transports:[
        // does not print the console only write the file
        new DailyRotateFile({
            filename:`${logDir}/results-%DATE%.log`,
            datePattern:'YYYY-MM-DD',
            maxSize:'7d',
        })
    ]
});

//allows to print console with pretty colors
// we dont want color escape characters in our log files
if(env !=='production'){
    logger.add( new winston.transports.Console({
        level,
        format:winston.format.printf((msg)=>{
            colorizer.colorize(msg.level,myFormat(msg))
        })
        })
    );
}


logger.stream = {
    write:function(message){
        logger.info(message)
    },
};


const logRequestIp=(request,response,next)=>{
    const clientIp=request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    request.logger=logger.child({ip:request.ip})
    return next()
}


const logUserDetails=(request,response,next)=>{
    const{_id,mobile,email}=request.body.user
    request.logger.info(JSON.stringify({_id,mobile,email}))
    return next()

}

export { logger,logRequestIp,logUserDetails}



