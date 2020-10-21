import { Router } from 'express'

import multer from 'multer'
import uploadConfig from './config/upload'

import OrphanagesController from './controllers/OrphanagesController'
import OrphanagesPasswordController from './controllers/OrphanagesPasswordController'

import AuthController from './controllers/AuthController'

import AdminController from './controllers/AdminController'

const route = Router()
const upload = multer(uploadConfig)

route.get('/', OrphanagesController.index)
route.get('/orphanages/:id', OrphanagesController.show)
route.post('/orphanages', upload.array('images'), OrphanagesController.store)
route.delete('/orphanages/:id', OrphanagesController.delete)

route.post('/orphanages/password-recovery', OrphanagesPasswordController.index)
route.patch('/orphanages/new-password', OrphanagesPasswordController.update)

route.post('/orphanages/update/:id', OrphanagesController.update)

route.post('/orphanage/authenticate', AuthController.orphanageAuth)

route.post('/app/admin/create', AdminController.store)
route.post('/app/admin/auth', AuthController.adminAuth)

export default route