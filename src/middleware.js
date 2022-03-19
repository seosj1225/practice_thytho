import express from 'express';  
import morgan from 'morgan';

const PORT = 4000;
const app = express()                
const logger = morgan('dev') // combined, common, short, tiny, dev

const middleWare1 = (req, res, next) => {
    const url = req.url
    if (url==="/protect") {
        return res.send("아무나 들어올 수 없습니다.")
    }
    next()
}


const handleHome = (req, res) => {
    return res.send("Home page")
}
const handleLogin = (req, res) => {
    return res.send("Login page")
}
const handleProtect = (req, res) => {
    return res.send("보안페이지")
}

app.use(logger)
app.get('/', handleHome)             
app.get('/login', handleLogin)   
app.get('/protect', middleWare1,  handleProtect)                                  


const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`)
app.listen(PORT, handleListening)    

