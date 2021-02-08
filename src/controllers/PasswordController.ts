import { Request, Response } from 'express'

import PasswordIndexService from '../services/passwordServices/PasswordIndexService'
import PasswordUpdateService from '../services/passwordServices/PasswordUpdateService'

class passwordController{
  index = async (req: Request, res: Response) => {        
    const { email } = req.body

    try {
      await PasswordIndexService.execute(email)
      return res.sendStatus(200)

    } catch (error) {
      return res.status(400).json({        
        error: error.message
      })

    }
  }    

  update = async (req: Request, res: Response) => {      
    const {            
      password,
      password_verify,          
    } = req.body   
    
    const { authorization } = req.headers

    if(!authorization) throw new Error('Authorization not found')
    
    const token = authorization?.replace('Bearer', '').trim()    

    try {
      await PasswordUpdateService.execute({
        password, 
        password_verify, 
        token
      })      
      return res.sendStatus(200)

    } catch(error) {      
      return res.status(400).json({
        status: 400,
        error: error.message
      })

    }
  }  
}

export default new passwordController