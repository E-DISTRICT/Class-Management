require('dotenv').config();
require('express-async-errors');

const cors = require('cors');

const path = require('path');
// extra security packages
const helmet = require('helmet');
const xss = require('xss-clean');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// routers
const instructorRouter = require('./routes/instructor');
const studentRouter = require('./routes/student');
const classesRouter = require('./routes/classes');
const assignmentRouter = require('./routes/assignment');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(helmet());

app.use(xss());

// routes
app.use('/api/v1/instructor', instructorRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/classes', classesRouter);
app.use('/api/v1/assignment', assignmentRouter);




app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, '0.0.0.0',() =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
