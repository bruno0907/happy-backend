import { NextFunction, Request, Response } from 'express'
import * as jwt from '../config/jwt'

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction){  
  const { authorization } = req.headers  
  
  if(!authorization) return res.status(401).json({
    status: 401,
    error: 'Authorization not found.'
  })      

  try {    
    const token = authorization.replace('Bearer', '').trim() 
    
    if(!token) return res.status(401).json({
      status: 401,
      error: 'Token is missing.'
    })
    
    const isValidToken = jwt.verify(token)    
    if(!isValidToken) return res.status(401).json({
      status: 401,
      error: 'Invalid/Expired Token.'
    })
  
    next()
    
  } catch (error) {
    return res.status(401).json({ 
      status: 401,
      error: error.message 
    })

  }
}