const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// loan environment variable.
dotenv.config({ path: './config/config.env' });

// connect to db
connectDB();


const bootcamps = require('./routes/bootcamps');

const app = express();

// body parser

app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running in ${PORT} in ${process.env.NODE_ENV} environment`.yellow.bold));

// handle unhandled promise rejection

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server and exit process.

  server.close(() => process.exit(1));
})
