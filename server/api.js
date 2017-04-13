'use strict';
var express = require('express');
var fileupload = require('./fileupload');
var filelist = require('./filelist');
const path = require('path');
const fs = require('fs');


module.exports = function(app) {
  //fileupload(app);

  let userRouter = express.Router();
  // you need to set mergeParams: true on the router,
  // if you want to access params from the parent router
  let itemRouter = express.Router({
    mergeParams: true
  });

  // you can nest routers by attaching them as middleware:
  userRouter.use('/item', itemRouter);

  userRouter.route('/')
    .get(function(req, res) {
      res.status(200)
        .send('api');
    });

  userRouter.route('/list')
    .get(function(req, res) {
      filelist('./dist/resource')
        .then(
          (list)=>{
            res.status(200)
              .json(list);
          },
          (err)=>{
            res.status(500).json({"errno":-200, "code": "ERROR", "message": err.message});
          }
        )
        .catch(err=>{
          res.json({"errno":-400,"code":"ERROR", "message": err.message});
        });
    });

  fileupload(userRouter);

  itemRouter.route('/')
    .get(function(req, res) {
      res.status(200)
        .send('item');
    });

  itemRouter.route('/:itemId')
    .get(function(req, res) {
      let fileName = './dist/resource/'+req.params.itemId+'.json';
      if (fs.existsSync(fileName)) {
        res.status(200).sendFile(path.resolve(__dirname.replace('server', ''),fileName));
      } else {
        res.status(400).json({"errno":-300, "code": "ERROR", "message": req.params.itemId+".json n't exist?"});
      }
    });

  app.use('/api', userRouter);
};