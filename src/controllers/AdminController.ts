import { Request, Response } from 'express'

import AdminStoreService from '../services/adminServices/AdminStoreService'

class AdminController{
  store = async (req: Request, res: Response) => {  
    const {
      name,
      email,
      password,
      password_verify,      
      isAdmin
    } = req.body

    if(password !== password_verify){
      return res.status(401).json({ 
        code: 401,
        error: 'Passwords dont match'})
    }     

    const data = {
      name,
      email,
      password,    
      isAdmin  
    }    

    try {
      const admin = await AdminStoreService.execute(data)
      return res.status(200).json(admin)

    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      })

    }

  }   
}

export default new AdminController