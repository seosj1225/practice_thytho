import express from 'express';
import { join, login, loging } from '../controllers/userController'
import { notice } from '../controllers/freeboardController'

const globalRouter = express.Router();

const handleHome = (req, res) => res.render("index.ejs") 
const program = (req, res) => res.render("program.ejs")
const write = (req, res) => res.render("write.ejs")

globalRouter.get('/', handleHome)
globalRouter.get('/join', join)
globalRouter.get('/write', write)
globalRouter.route('/login').get(login).post(loging)


export default globalRouter