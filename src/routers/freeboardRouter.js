import express from 'express';
import { list, write, writting, view, edit, editting, remove, pagegroup } from '../controllers/freeboardController'
const freeboardRouter = express.Router();

freeboardRouter.get('/list', list)
freeboardRouter.route('/write').get(write).post(writting)
freeboardRouter.get('/view', view)
freeboardRouter.route('/edit').get(edit).post(editting)
freeboardRouter.get('/remove', remove)
freeboardRouter.get('/pagegroup', pagegroup)

export default freeboardRouter