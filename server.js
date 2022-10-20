const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean')
const rateLimits = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors')

// loan environment variable.
dotenv.config({ path: './config/config.env' });

// connect to db
connectDB();


const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');
const review = require('./routes/review');

const app = express();

// body parser
app.use(express.json());

app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file upload
app.use(fileupload());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

app.use(cors());

const limiter = rateLimits({
  windowMS: 10 * 60 * 1000, // 10 mins
  max: 100
});

app.use(limiter);

app.use(hpp());


app.use(express.static(path.join(__dirname, 'public')));


// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/reviews', review);

// error handler
app.use(errorHandler);

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
