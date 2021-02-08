import { Request } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'
import crypto from 'crypto'
import path from 'path'

// export default {
//   storage: multer.diskStorage({
//     destination: path.join(__dirname, '..', '..', 'tmp', 'uploads'),
//     filename: (req, file, cb) => {
//       const fileName = `${Date.now()}-${file.originalname}`
//       cb(null, fileName)
//     }
//   })  
// }

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
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
  // }),

  // s3: multerS3({
  //   s3: new aws.S3(),
  //   bucket: String(process.env.BUCKET_NAME),
  //   contentType: multerS3.AUTO_CONTENT_TYPE,
  //   acl: 'public-read',
  //   key: (req, file, cb) => {
  //     crypto.randomBytes(16, (err, hash) => {
  //       if(err){
  //         return cb(err)
  //       }
  //       const fileName = `${hash.toString('hex')}-${file.originalname}`
  //       cb(null, fileName)
  //     })
  //   }
  })
}

export default {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes.local,
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,    
  },  
  fileFilter: (req: Request, file: { mimetype: string } , cb: (arg0: Error, arg1: boolean) => void) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif'
    ]

    allowedMimes.includes(file.mimetype) && cb(new Error('Upload Error'), true)
  }
}