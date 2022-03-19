import http from 'http'
import WebSocket from 'ws'
import express from 'express';       
import morgan from 'morgan';
import session from 'express-session'
import globalRouter from './routers/globalRouter'
import userRouter from './routers/userRouter'
import freeboardRouter from './routers/freeboardRouter'
import { locals } from './localsMiddleware'

const PORT = 4000;
const app = express()
const logger = morgan('dev')                

const server = http.createServer(app)
const wss = new WebSocket.Server({server})

const sockets = []
wss.on("connection", (socket)=>{
    sockets.push(socket);
    socket["nickname"] = "무명";
    console.log("Connected to Browser");
    socket.on("close", ()=>console.log("Disconnected to Browser"));
    socket.on("message", (msg)=>{
        const message = JSON.parse(msg);
        switch(message.type) {
            case "new_message":sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`)); break;
            case "nickname":socket["nickname"]=message.payload; 
        }
    });
});



app.set('views', __dirname+'/views');           // view 경로 설정
app.set('view engine', 'ejs');                  // 템플릿 엔진을 ejs로 설정
// app.engine('html', require('ejs').renderFile);  // html 파일을 ejs로 
app.use(express.static(__dirname+'/public'));   // 기본 경로를 /public으로 설정

// app.use(cookieParser())
app.use(logger)
app.use(session({                    
    secret:"Hello!",
    resave:true,
    saveUninitialized:true
}))
app.use((req, res, next)=>{
    req.sessionStore.all((error, sessions)=>{
        console.log(sessions)                
        next()                               
    })
})
app.use(locals)
app.use('/', globalRouter)             
app.use('/users', userRouter)
app.use('/freeboard', freeboardRouter)



const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`)
server.listen(PORT, handleListening)   

