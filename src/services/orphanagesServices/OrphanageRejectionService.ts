import { sign } from "jsonwebtoken"
import { getRepository } from "typeorm"
import Orphanage from "../../models/Orphanage"
import { sendEmail } from "../../modules/sendMail"

interface OrphanageProps{
  id: number;
}

class OrphanageRejectionService{
  execute = async(id: OrphanageProps) =>{
    const orphanageRepository = getRepository(Orphanage)
    
    try {      
      const orphanage = await orphanageRepository.findOne(id)   
      
      if(!orphanage) throw new Error('Orphanage not found.')

      const { name, email } = orphanage

      const token = sign(
        { id, name, email },
        process.env.SECRET_KEY,        
      )
      
      sendEmail({
        name, 
        email,  
        token,               
        subject: `Revise seus dados ${name} - Happy`,
        message: `Infelizmente seu cadastro não foi aprovado. Acesse o link abaixo para revisar seus dados e encaminhe novamente seu registro.`,                
        link: `http://localhost:3000/app/dashboard/orphanage/edit/${id}`,    
      })
      return

    } catch (error) {
      throw Error(error.message)

    }    
  }
}

export default new OrphanageRejectionService