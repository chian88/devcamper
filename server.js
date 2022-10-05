const express = require('express');
const dotenv = require('dotenv');

const bootcamps = require('./routes/bootcamps');

dotenv.config({path: './config/config.env'});

const app = express();


// mount routers

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running in ${PORT} in environment ${process.env.NODE_ENV}`));