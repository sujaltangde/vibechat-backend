const http = require('http')
const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io')


const app = express();

const users = [{}] 

app.use(cors({
	origin: "*",
	credentials: true
}))


const port = 4500 || process.env.PORT ;

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
      origin: '*',
    }
  });

app.get('/',(req,res)=>{
    res.json("hey mom")
})



io.on('connection',(socket)=>{
    console.log("new Connection") ;

    socket.on('joined',({user})=>{
        users[socket.id] = user ;
        console.log(`${user} has Joined`)
        socket.broadcast.emit("userJoined",{user:"Admin",message:`${users[socket.id]} has joined`})
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat ${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
        
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} user has left`})
        console.log("user left") ;

    })
})

server.listen(port,()=>{
    console.log(`server is running on ${port}`)
})