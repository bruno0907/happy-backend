import { getRepository } from "typeorm"
import Orphanage from "../../models/Orphanage"
import Email from "../../modules/sendMail"

import * as jwt from '../../config/jwt'

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

      const payload = { id, name, email }
      const token = jwt.sign(payload, 86400)

      // Save on DB the orphanage token for authentication safety

      const rejectionEmail = new Email({
        name,
        email,        
        subject: `Revise seus dados ${name} - Happy`,
        message: `Infelizmente seu cadastro não foi aprovado. Acesse o link abaixo para revisar seus dados e encaminhe novamente seu registro.`,
        link: `${process.env.APP_URL}/app/dashboard/orphanage/edit/auth=${token}`,
      })
      rejectionEmail.send()      
      
      return

    } catch (error) {
      throw Error(error.message)

    }    
  }
}

export default new OrphanageRejectionService