const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')
const bodyParser = require('body-parser');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const app = express();
admin.initializeApp();

app.use(bodyParser.urlencoded({extended: true}))

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
