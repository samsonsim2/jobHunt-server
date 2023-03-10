import { register, login, updateUser } from '../controllers/authController.js'
import express from 'express'
import authenticateUser from '../middlware/auth.js'
const router = express.Router()

router.route('/register').post(register).get(register)

router.route('/login').post(login)

router.route('/updateUser').patch(authenticateUser, updateUser)

export default router
