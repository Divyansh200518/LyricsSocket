const http = require('http').createServer();
const io = require('socket.io')(http,{
    cors:{origin: "*"}
})

io.on('connection',socket =>{
    console.log("A user connected")

    socket.on('message',(message)=>{
        console.log(message);
        io.emit('message', "back hi")
    })

})

http.listen(8080, () =>console.log('listening on http://localhost:8080'));


function logger(){
    console.log("Finally")
}