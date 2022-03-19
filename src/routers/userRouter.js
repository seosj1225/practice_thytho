import express from 'express';
import { edit, editing, memberout, register, logout, idchk, findid, findingid, findpw, findingpw } from '../controllers/userController'
const userRouter = express.Router();

userRouter.get('/edit', edit)
userRouter.post('/editing', editing)
userRouter.get('/memberout', memberout)
userRouter.post('/register', register)
userRouter.get('/logout', logout)
userRouter.get('/idchk', idchk)
userRouter.route('/findid').get(findid).post(findingid)
userRouter.route('/findpw').get(findpw).post(findingpw)

export default userRouter