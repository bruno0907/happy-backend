import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Admin from '../models/Admin'

class AdminController{
  store = async (req: Request, res: Response) => {  
    const adminRepository = getRepository(Admin) 

    const {
      name,
      email,
      password,
      password_verify,      
    } = req.body

    if(password !== password_verify){
      return res.status(401).json({ error: 'Passwords dont match'})
    }     

    const data = {
      name,
      email,
      password,      
    }    

    const schema = Yup.object().shape({
      name: Yup.string().required(),      
      email: Yup.string().required(),
      password: Yup.string().required(),      
    })

    await schema.validate(data, {
      abortEarly: false,
    })
  
    const admin = adminRepository.create(data)  
    await adminRepository.save(admin)    

    delete admin.password

    return res.status(201).json(admin)    
  } 
  
}

export default new AdminController