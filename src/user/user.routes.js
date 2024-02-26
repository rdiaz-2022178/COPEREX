import {Router} from 'express'
import { login, signUp } from './user.controller.js'

const api = Router()

api.post('/add', signUp)
api.post('/login', login)

export default api