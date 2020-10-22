import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Admin from '../models/Admin'

import {sendEmail} from '../modules/sendMail'

class AdminPasswordController{
  index = async (req: Request, res: Response) => {
    const adminRepository = getRepository(Admin)

    const { email } = req.body

    const user = await adminRepository.findOne({ where: { email }})

    if(!user){
      return res.status(401).json({ message: 'User not found'})
    }

    const { name } = user

    sendEmail({name, email})
    
    return res.sendStatus(200)
    
  }

  update = async (req: Request, res: Response) => {      
    const {      
      email,
      password,
      password_verify      
    } = req.body    

    const data = {      
      email,
      password,
      password_verify
    }
    
    const schema = Yup.object().shape({        
      email: Yup.string().required(),
      password: Yup.string().required(),
      password_verify: Yup.string().required()
    })

    await schema.validate(data, {
      abortEarly: false,
    })  

    if(password !== password_verify){
      return res.sendStatus(401)
    }      
    
    const adminRepository = getRepository(Admin)

    const user = await adminRepository.findOne({ where: { email }})
    user.password = password
    await adminRepository.save(user)

    res.sendStatus(200)
  }
  
}

export default new AdminPasswordController