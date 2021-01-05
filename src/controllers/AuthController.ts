import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import Admin from '../models/Admin'
import Orphanage from '../models/Orphanage'


class AuthController{
  auth = async(req: Request, res: Response) => {
    const adminRepository = getRepository(Admin)    
    const orphanageRepository = getRepository(Orphanage)

    const { authorization } = req.headers
    const credentials = Buffer.from(authorization.replace('Basic', '').trim(), 'base64').toString()
    const [username, password] = credentials.split(':')


    try {  
      const admin = await adminRepository.findOne({ where: { email: username }})
  
      if(!admin){
        const orphanage = await orphanageRepository.findOne({ where: { email: username }})

        if(!orphanage){
          console.log('Orphanage')
          return res.sendStatus(401)
        }

        const isValidPassword = await compare(password, orphanage.password)
  
        if (!isValidPassword) {
          return res.sendStatus(401)
        }

        const token = sign(
          { id: orphanage.id},
          process.env.SECRET_KEY,
          { expiresIn: 86400 }
        )

        delete orphanage.password

        return res.status(200).json({
          orphanage,
          token
        })
        
      }
  
      const isValidPassword = await compare(password, admin.password)
  
      if (!isValidPassword) {
        return res.sendStatus(401)
      }
  
      const token = sign(
        { id: admin.id }, // Payload (informações a serem armazenadas do usuário dentro do token)
        process.env.SECRET_KEY, // Secret key de decrypt do token 
        { expiresIn: 86400 } // tempo de duração do token
      )    

      delete admin.password

      return res.status(200).json({ 
        admin,
        token
      })
      
    } catch (error) {
      return res.status(500).json(error)
    }
  }  

}

export default new AuthController