import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import Admin from '../models/Admin'

class AuthController{
  adminAuth = async(req: Request, res: Response) => {
    const adminRepository = getRepository(Admin)        

    const { authorization } = req.headers
    const credentials = Buffer.from(authorization.replace('Basic', '').trim(), 'base64').toString()
    const [username, password] = credentials.split(':')

    try {  
      const admin = await adminRepository.findOne({ where: { email: username }})
  
      const isValidPassword = await compare(password, admin.password)
  
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Administrator username or password not found!'})
      }
  
      const token = sign(
        { id: admin.id }, // Payload (informações a serem armazenadas do usuário dentro do token)
        process.env.SECRET_KEY, // Secret key de decrypt do token 
        { expiresIn: 86400 } // tempo de duração do token
      )    

      delete admin.password

      return res.status(202).json({ 
        admin,
        token
      })
      
    } catch (error) {
      return res.status(500).json(error)
    }
  }  

}

export default new AuthController