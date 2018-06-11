'use strict';

import express from 'express';
const router = express.Router();

// modelFinder middleware reads :model in the URLs and susses out the right model to use.
// As you'll see, it gets jacked on to req.model so that you can reference it in your routes
import modelFinder from '../middleware/models.js';
router.param('model', modelFinder);

/**
 * Render all records of a model
 */
router.get('/api/v1/:model', (req,res) => {
  req.model.fetchAll()
    .then( data => sendJSON(res,data) )
    .catch(err => {throw err;});
});

router.get('/api/v1/:model/:id', (req,res) => {
  req.model.findOne(req.params.id)
    .then( data => { sendJSON(res,data)} )
    .catch(err => { throw err; });
});

router.delete('/api/v1/:model/:id', (req,res) => {
  if ( req.params.id ) {
    let result = {action:'delete',id:req.params.id};
    sendJSON(res,result);
  }
  else {
    throw 'Record Not Found';
  }

});

router.post('/api/v1/:model', (req,res) => {
  let record = new req.model(req.body);
  record.save()
    .then(data => sendJSON(res,data))
    .catch(console.error);

});

/**
 * Simple method to send a JSON response (all of the API methods will use this)
 * @param res
 * @param data
 */
let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};

export default router;