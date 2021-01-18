import { compare } from "bcryptjs"
import { getRepository } from "typeorm"

import * as jwt from '../../config/jwt'

import Admin from "../../models/Admin"

interface AdminProps{  
  username: string;
  password: string;
}

class AdminAuthService{
  execute = async({ username, password }: AdminProps) => {
    const adminRepository = getRepository(Admin)  

    const admin = await adminRepository.findOne({ where: { email: username }})

    if(!admin) throw new Error('Username or password not found.')
  
    const isValidPassword = await compare(password, admin.password)

    if (!isValidPassword) throw new Error('Username or password not found!')    

    delete admin.password

    const payload = { admin }
    const token = jwt.sign(payload, 86400)    

    return {
      admin,
      token
    }
  }

}
export default new AdminAuthService