import { verify } from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'
import Admin from '../../models/Admin'

interface AdminProps{
  password: string;
  password_verify: string;
  token: string;
}

interface TokenProps{
  email: string;
}

class PasswordUpdateService{
  execute = async({
    password,
    password_verify,
    token
  }: AdminProps) => {
    
    try {   
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
      
      if(password !== password_verify) throw new Error('Passwords dont match')

      const { email } = verify(token, String(process.env.SECRET_KEY)) as TokenProps 
      
      const adminRepository = getRepository(Admin)
      const admin = await adminRepository.findOne({ where: { email }})

      if(!admin) throw new Error('User not found')

      admin.password = password
      await adminRepository.save(admin)

      return

    } catch (error) {
      throw Error(error.message)

    }
  }
}

export default new PasswordUpdateService