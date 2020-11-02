import { Router } from 'express'

import multer from 'multer'
import uploadConfig from './config/upload'

import OrphanagesController from './controllers/OrphanagesController'
import OrphanagesPasswordController from './controllers/OrphanagesPasswordController'

import AuthController from './controllers/AuthController'

import AdminController from './controllers/AdminController'
import AdminPasswordController from './controllers/AdminPasswordController'
import ImagesController from './controllers/ImagesController'

const route = Router()
const upload = multer(uploadConfig)

route.get('/orphanages', OrphanagesController.index)
route.get('/orphanages/:id', OrphanagesController.show)
route.post('/orphanages', upload.array('images'), OrphanagesController.store)
route.post('/orphanages/authenticate', AuthController.orphanageAuth)

route.post('/orphanages/password-recovery', OrphanagesPasswordController.index)
route.patch('/orphanages/new-password', OrphanagesPasswordController.update)

route.post('/app/admin/password-recovery', AdminPasswordController.index)
route.patch('/app/admin/new-password', AdminPasswordController.update)

route.delete('/app/orphanages/delete/:id', OrphanagesController.deleteOrphanage)
route.patch('/app/orphanages/approve/:id', OrphanagesController.approveOrphanage)

route.delete('/app/orphanage/image/remove/:id', ImagesController.deleteImage)

route.post('/app/admin/create', AdminController.store)
route.post('/app/admin/authenticate', AuthController.adminAuth)

export default route