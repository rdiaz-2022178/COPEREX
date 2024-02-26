import {Router} from 'express'
import { add, filterAZ, filterImpact, filterYears, filterZA, update, generateXLSX } from './company.controller.js'

const api = Router()

api.post('/add', add)
api.put('/update/:id', update)
api.get('/filterAZ', filterAZ)
api.get('/filterZA', filterZA)
api.get('/filterYear', filterYears)
api.get('/filterImpact', filterImpact)
api.get('/generateExcel', generateXLSX)

export default api