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

function getTokens(snapshot){
  if(snapshot.exists()){
    const data = snapshot.val()
    const keys = Object.keys(data)
    const tokens = []
    for(var i=0;i < len(keys);i++){
      tokens.push(data[keys[i]])
    }
    return tokens
  }
  return null
}

function cleanup(response,tokens,keys){
  const tokensToRemove = {}
  response.results.forEach(function(result,index){
    const error = result.error
    if(error){
      console.error('Failure sending notification to ',tokens[index],error)
      if(error.code == 'messaging/invalid-registration-token' || error.code == 'messaging/registration-token-not-registered'){
        tokensToRemove[`/data/fcm/tokens/${keys[index]}`] = null
        tokensToRemove[`/data/fcm/user/${keys[index]}`] = null
      }
    }
  })
  return admin.database().ref().update(tokensToRemove)
}

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

app.get("/sendnotif/custom",async(function(req,res,next){
  const payload = {
    data: {
      "heading": req.body.headingt,
      "content": req.body.content
    }
  }
  const allTokens = await(admin.database().ref("/data/fcm/tokens"))
  const tokens = getTokens(allTokens)
  if(tokens != null){ 
    const response = await(admin.messaging().sendToDevice(tokens,payload))  
    await(cleanup(response,tokens,Object.keys(allTokens.val())))
    res.status(203).json({
      "response": "Notification sent"
    })
  }
  else{
    res.status(500).json({
      "response": "No tokens present"
    })
  }
  
}))

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
