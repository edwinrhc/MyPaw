import express from 'express'
import { servicios } from '../controllers/apiController.js'

const router = express.Router()



router.get('/servicios',servicios )

export default router