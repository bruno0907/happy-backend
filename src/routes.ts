import { Router, Request, Response } from 'express'

import multer from 'multer'
import uploadConfig from './config/multer'

import OrphanagesController from './controllers/OrphanagesController'

import AuthController from './controllers/AuthController'

import AdminController from './controllers/AdminController'
import PasswordController from './controllers/PasswordController'
import ImagesController from './controllers/ImagesController'

import AuthMiddleware from './middlewares/authMiddleware'

const route = Router()
const upload = multer(uploadConfig)

route.get('/authenticate', AuthMiddleware, (req: Request, res: Response) => res.sendStatus(200))

route.get('/orphanages', OrphanagesController.index)
route.get('/orphanages/:id', OrphanagesController.show)
route.post('/orphanages', upload.array('images'), OrphanagesController.store)

route.post('/password-recovery', PasswordController.index)
route.patch('/new-password', AuthMiddleware, PasswordController.update)

route.patch('/orphanages/approve/:id', AuthMiddleware, OrphanagesController.approveOrphanage)
route.get('/orphanages/reject/:id', AuthMiddleware, OrphanagesController.rejectOrphanage)
route.patch('/orphanages/update/:id', AuthMiddleware, upload.array('images'), OrphanagesController.updateOrphanage)
route.delete('/orphanages/delete/:id', AuthMiddleware, OrphanagesController.deleteOrphanage)

route.delete('/orphanages/image/remove/:id', AuthMiddleware, ImagesController.removeOrphanageImage)

route.post('/admin/create', AdminController.store)

route.get('/sign-in', AuthController.adminAuth)
route.get('/me', AuthMiddleware, AuthController.orphanageAuth)

export default route