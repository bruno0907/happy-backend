import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import { sign, verify, decode } from 'jsonwebtoken'

import Admin from '../models/Admin'

import {sendEmail} from '../modules/sendMail'

interface TokenProps{
  email: string;
}

class AdminPasswordController{
  index = async (req: Request, res: Response) => {
    const adminRepository = getRepository(Admin)

    const { email } = req.body

    const user = await adminRepository.findOne({ where: { email }})

    if(!user){
      return res.status(401).json({ message: 'User not found'})
    }

    const { name } = user

    const token = sign(
      {
        id: user.id,
        email: user.email,
      }, 
      process.env.SECRET_KEY, 
      {
        expiresIn: '1d'
      }
    )

    sendEmail({name, email, token})
    
    return res.sendStatus(200)
    
  }

  update = async (req: Request, res: Response) => {      
    const {            
      password,
      password_verify,    
      token
    } = req.body    

    const data = {        
      password,
      password_verify,
      token
    }
    
    const schema = Yup.object().shape({        
      password: Yup.string().required(),
      password_verify: Yup.string().required(),
      token: Yup.string().required(),
    })

    await schema.validate(data, {
      abortEarly: false,
    })  

    if(password !== password_verify){
      return res.sendStatus(400)
    }      

    try {
      const isTokenValid = verify(token, process.env.SECRET_KEY)    

      if(!isTokenValid){
        return res.sendStatus(400)
      }

      const { email } = isTokenValid as TokenProps
      
      const adminRepository = getRepository(Admin)

      const user = await adminRepository.findOne({ where: { email }})
      user.password = password
      await adminRepository.save(user)

      res.sendStatus(200)
    } catch {
      return res.sendStatus(400)
    }
  }
  
}

export default new AdminPasswordController