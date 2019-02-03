const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')
const bodyParser = require('body-parser');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const httpErrors = require('http-errors');
const cors = require('cors');
const config = require('./config.js');
const app = express();

admin.initializeApp();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

function getTokens(snapshot){
    const data = snapshot.val()
    const keys = Object.keys(data)
    const tokens = []
    for(var i=0;i < len(keys);i++){
      tokens.push(data[keys[i]])
    }
    return tokens
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

async(function sendNotification(tokens,keys,payload){
  const response = await(admin.messagin().sendToDevice(tokens,payload))
  if(response.error == null){
    console.log(response.successCount)
  }
  await(cleanup(response,tokens,keys))
})

app.use(function(req,res,next){
  if(req.body.api_key == config.API_KEY){
    next()
  }
  else{
    next(httpErrors(403,"Forbidden"))
  }
})

app.get("/sendnotif/play",async(function(req,res){
  console.log("Here")
  const allTokens = await(admin.database().ref("/data/fcm/token"))
  const tokens = getTokens(allTokens)
  if(tokens != null){
    const payload = {
      data: {
        "type": "play"
      }
    }
    await(sendNotification(tokens,Object.keys(allTokens.val()),payload))
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

app.get("/sendnotif/custom",async(function(req,res){
  const allTokens = await(admin.database().ref("/data/fcm/tokens"))
  const tokens = getTokens(allTokens)
  if(tokens != null){ 
    const payload = {
      data: {
        "heading": req.body.heading,
        "content": req.body.content,
        "type": "custom"  
      }
    }
    await(sendNotification(tokens,Obkect.keys(allTokens.val()),payload))
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