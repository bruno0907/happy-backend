import { getRepository } from "typeorm"
import Orphanage from "../../models/Orphanage"
import Email from "../../modules/sendMail"

import * as jwt from '../../config/jwt'

class OrphanageRejectionService{
  execute = async(id: string) =>{
    const orphanageRepository = getRepository(Orphanage)
    
    try {      
      console.log(id)
      const orphanage = await orphanageRepository.findOne(id)   
      
      if(!orphanage) throw new Error('Orphanage not found.')

      const { name, email } = orphanage      

      const payload = { id, name, email }
      const token = jwt.sign(payload, 86400)

      orphanage.token = token
      await orphanageRepository.save(orphanage)

      const rejectionEmail = new Email({
        name,
        email,        
        subject: `Revise seus dados ${name} - Happy`,
        message: `Infelizmente seu cadastro não foi aprovado. Acesse o link abaixo para revisar seus dados e encaminhe novamente seu registro.`,
        link: `${process.env.APP_URL}/orphanages/edit/${id}/auth=${token}`,        
      })
      rejectionEmail.send()      
      
      return

    } catch (error) {
      throw Error(error.message)

    }    
  }
}

export default new OrphanageRejectionService