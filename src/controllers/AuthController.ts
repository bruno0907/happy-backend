import { Request, Response } from 'express'

import AdminAuthService from '../services/authServices/AuthService'

class AuthController{
  auth = async(req: Request, res: Response) => {
    const { authorization } = req.headers
    const credentials = Buffer.from(authorization.replace('Basic', '').trim(), 'base64').toString()
    const [username, password] = credentials.split(':')

    try {  
      const response = await AdminAuthService.execute({        
        username,
        password
      })          
      return res.status(202).json(response)
      
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      })
    }
  }  

}

export default new AuthController