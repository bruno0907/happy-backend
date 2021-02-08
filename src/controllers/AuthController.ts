import { Request, Response } from 'express'

import AdminAuthService from '../services/adminServices/AdminAuthService'
import OrphanageAuthService from '../services/orphanagesServices/OrphanageAuthService'

class AuthController{
  adminAuth = async(req: Request, res: Response) => {
    const { authorization } = req.headers

    if(!authorization) throw new Error('Authorization not found')
    
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
  
  orphanageAuth = async(req: Request, res: Response) => {    
    const { id, authorization } = req.headers    
    const token = authorization?.replace('Bearer', '').trim()
    
    try {
      await OrphanageAuthService.execute({id, token})
      return res.sendStatus(200)    
      
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message
      })

    }
  }
}

export default new AuthController