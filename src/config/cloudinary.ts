import * as Cloudinary from 'cloudinary'

const cloudinary = Cloudinary.v2

cloudinary.config({
  cloud_name: String(process.env.CLOUD_NAME),
  api_key: String(process.env.API_KEY),
  api_secret: String(process.env.API_SECRET),
})

export default cloudinary