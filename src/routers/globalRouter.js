import express from 'express';
import { join, login, loging } from '../controllers/userController'
import { notice } from '../controllers/freeboardController'

const globalRouter = express.Router();

const handleHome = (req, res) => res.render("index.ejs") 
const program = (req, res) => res.render("program.ejs")

globalRouter.get('/', handleHome)
globalRouter.get('/join', join)
globalRouter.route('/login').get(login).post(loging)


export default globalRouter