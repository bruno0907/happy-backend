import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { getRepository } from "typeorm"

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

    const token = sign(
      { id: admin.id }, // Payload (informações a serem armazenadas do usuário dentro do token)
      process.env.SECRET_KEY, // Secret key de decrypt do token 
      { expiresIn: 86400 } // tempo de duração do token
    )    

    delete admin.password

    return { 
      admin,
      token
    }

  }

}
export default new AdminAuthService