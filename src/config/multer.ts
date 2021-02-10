import { Request } from 'express'
import multer from 'multer'
import crypto from 'crypto'
import path from 'path'

import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary'

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024

const storageTypes = {
  local: multer.diskStorage({
    destination: async (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))      
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if(err) {
          return cb(err, file.filename)
        }
        const fileName = `${hash.toString('hex')}-${file.originalname}`
        cb(null, fileName)
      })
    }  
  }),
  cloudinary: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'happy/orphanage_images',
      allowed_formats: ['jpg', 'png', 'gif'],    
    }
  })
}

export default {
  // dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),  
  storage: storageTypes.cloudinary,  
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,    
  },  
  fileFilter: (req: Request, file: { mimetype: string } , cb: (arg0: Error | null, arg1?: boolean) => void) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif'
    ]
    
    if(allowedMimes.includes(file.mimetype)){
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
}