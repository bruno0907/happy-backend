import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import Orphanage from '../models/Orphanage'
import Admin from '../models/Admin'

class AuthController{
  orphanageAuth = async( req: Request, res: Response ) => {    
    try {
      return res.status(201).json(req.params.authorization)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  adminAuth = async(req: Request, res: Response) => {
    const adminRepository = getRepository(Admin)

    const { authorization } = req.headers
    const credentials = Buffer.from(authorization.replace('Basic', '').trim(), 'base64').toString()
    const [username, password] = credentials.split(':')


    try {  
      const user = await adminRepository.findOne({ where: { email: username }})
  
      if(!user){
        return res.sendStatus(401)
      }
  
      const isValidPassword = await compare(password, user.password)
  
      if (!isValidPassword) {
        return res.sendStatus(401)
      }
  
      const token = sign(
        { id: user.id }, // Payload (informações a serem armazenadas do usuário dentro do token)
        process.env.SECRET_KEY, // Secret key de decrypt do token 
        { expiresIn: 86400 } // tempo de duração do token
      )    

      delete user.password // Requires revision of why i was sending the user password to the response

      return res.status(200).json({ 
        user,
        token
      })
      
    } catch (error) {
      return res.status(500).json(error)
    }
  }  

}

export default new AuthController