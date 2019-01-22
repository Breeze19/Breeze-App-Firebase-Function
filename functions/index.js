const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')
const bodyParser = require('body-parser');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const httpErrors = require('http-errors');
const config = require('./config.js');
const app = express();

admin.initializeApp();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use(function(req,res,next){
  if(req.body.api_key == config.API_KEY){
    next()
  }
  else{
    next(httpErrors(403,"Forbidden"))
  }
})

app.get("/sendnotif/register",function(req,res){
  
})

app.get("/sendnotif/event",function(req,res){

})

app.use(function(req,res,next){
  next(httpErrors(404,"Page not found"))
})

module.exports.api = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
