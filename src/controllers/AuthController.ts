import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import Orphanage from '../models/Orphanage'
import Admin from '../models/Admin'

class AuthController{
  orphanageAuth = async( req: Request, res: Response ) => {
    const orphanageRepository = getRepository(Orphanage)

    const { email, password } = req.body    

    const user = await orphanageRepository.findOne({ where: { email }})

    if(!user){
      return res.sendStatus(401)
    }

    const isValidPassword = await compare(password, user.password)

    if(!isValidPassword){
      return res.sendStatus(401)
    }

    const token = sign(
      { id: user.id }, // Payload (informações a serem armazenadas do usuário dentro do token)
      process.env.SECRET_KEY, // Secret key de decrypt do token 
      { expiresIn: '1d' } // tempo de duração do token
    )    

    delete user.password

    return res.status(200).json({ 
      user,
      token
    })
  }

  adminAuth = async( req: Request, res: Response ) => {
    const adminRepository = getRepository(Admin)

    const { email, password } = req.body

    const user = await adminRepository.findOne({ where: { email }})

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
      { expiresIn: '1d' } // tempo de duração do token
    )    

    delete user.password

    return res.status(200).json({ 
      user,
      token
    })
  }  

}

export default new AuthController