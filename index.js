const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const ServerKey = process.env.Port || 3000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { resolve } = require('node:path/win32');
require('dotenv').config()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

const AI = new GoogleGenerativeAI(process.env.api); //FameerPatil

async function run(prop) {

  const model = AI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = prop;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  // if(index  == -1){
    // let data = distributer(text);
    // text = "task Assigned!";
    // let toID = await findacc(data.To);
    // Task_sender(toID,data.To,data.Task,data.Till);
  // }

  
  
  console.log(text);

  return text;

}

io.on('connection', (socket) => {
    // console.log('a user connected');
    // socket.on('disconnect', () => {
    // console.log('user disconnected');
    // });


    // socket.on('chat message', (msg) => {
    //     // console.log('message: ' + msg);
    //     io.emit('chat message', msg);
    // });


    socket.on('chat message', (msg) => {
        // console.log('message: ' + msg);
        let output=run(msg).then((res)=>{
        // io.emit('chat message', msg);
        io.emit('chat message',res);
        });
 
    });

    // socket.on('secretkey', (userID) => {
    //     var secret = userID;
    //     console.log(secret);
    //     var done = "Done";
    //     io.emit('secretkey',done,secret)
    // });


});


server.listen(ServerKey, () => {
  console.log('listening on *:'+ServerKey);
});
