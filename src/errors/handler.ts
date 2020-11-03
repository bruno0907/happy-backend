import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'

interface ValidationErrors {
  [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  try {
    if(error instanceof ValidationError){
      let errors: ValidationErrors = {}
  
      error.inner.forEach(error => {
        errors[error.path] = error.errors
      })
  
      return response.status(400).json({ message: 'Validation Errors', errors })
    }  
  
    return response.sendStatus(500)
    
  } catch {
    return response.sendStatus(500)
  }
}

export default errorHandler