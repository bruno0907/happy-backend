import { getRepository } from "typeorm"
import * as Yup from 'yup'

import Admin from "../../models/Admin"

interface AdminProps{
  name: string;
  email: string;
  password: string;
  isAdmin: boolean
}

class AdminStoreService {
  execute = async(data: AdminProps) => {
    const adminRepository = getRepository(Admin) 

    const schema = Yup.object().shape({
      name: Yup.string().required(),      
      email: Yup.string().email().required(),
      password: Yup.string().required(),  
      isAdmin: Yup.boolean().required()
    })

    await schema.validate(data, {
      abortEarly: false,
    })

    try {
      const admin = adminRepository.create(data)  
      await adminRepository.save(admin)
      
      if(!admin) throw new Error('And error has ocurried while creating a new register.')

      delete admin.password

      return admin
      
    } catch (error) {
      throw Error(error.message)

    } 
     
  }
}

export default new AdminStoreService