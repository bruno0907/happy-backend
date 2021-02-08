import { getRepository } from "typeorm"

import * as jwt from '../../config/jwt'
import * as Yup from 'yup'

import Admin from "../../models/Admin"
import Email from "../../modules/sendMail"

const APP_URL = process.env.APP_URL

class PasswordIndexService{  
  
  execute = async(email: string) => {
    const adminRepository = getRepository(Admin)
    
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required()

      })  
      await schema.validate({ email }) 

      const admin = await adminRepository.findOne({ where: { email } })

      if(!admin) throw new Error('User not found')

      const { id, name } = admin

      const payload = { id, email }
      const token = jwt.sign(payload, 86400)
  
      const newPasswordEmail = new Email({
        name, 
        email, 
        subject: 'Solicitação de redefinição de senha - Happy',
        message: 'Então você esqueceu sua senha? Não tem problema! Clique no link abaixo e você será redirecionado para redefinir sua senha.',        
        link: `${APP_URL}/new-password?key=${token}`
      })
      newPasswordEmail.send()

      return
      
    } catch (error) {
      throw Error(error.message)
      
    }  

  }
}
export default new PasswordIndexService