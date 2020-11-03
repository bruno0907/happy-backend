import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction){
  const { authorization } = req.headers

  if(!authorization){
    return res.status(401).json({ message: 'Authorization not found.'})
  }

  try {
      
    const token = authorization.replace('Bearer', '').trim()
    if(!token){
      return res.status(401).json({ message: 'Token is missing.'})
    }    
    
    const isValidToken = verify(token, process.env.SECRET_KEY)
    if(!isValidToken){      
      return res.status(401).json({ message: 'Invalid/Expired Token.'})
    }
  
    next()
    
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
    
  }
}