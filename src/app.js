'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';

let app = express();

let corsOptions = {
  origin: 'http://example.com'
};

// Express and 3rd Party Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Our API
import router from './api/api.js';
app.use(router);

// Our 404 Error
app.use(notFound);

// Our Error Handler
app.use(errorHandler);

// Flag to know if we are up and going
let isRunning = false;

module.exports = {
  start: (port) => {
    if(! isRunning) {
      app.listen(port, (err) => {
        if(err) { throw err; }
        // Tick the running flag
        isRunning = true;
        console.log('Server is up on port', port);
      });
    }
    else {
      console.log('Server is already running');
    }
  },

  stop: () => {
    app.close( () => {
      isRunning = false;
      console.log('Server has been stopped');
    });
  },
};