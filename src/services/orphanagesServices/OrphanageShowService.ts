import { getRepository } from "typeorm"
import Orphanage from "../../models/Orphanage"

interface OrphanageProps{
  id: number;
}

class OrphanageShowService {
  execute = async(id: OrphanageProps) => {
    const orphanagesRepository = getRepository(Orphanage)  
    
    try {
      const orphanage = await orphanagesRepository.findOne(id, {
        relations: ['images']
      })    

      if(!orphanage) throw new Error('Orphanage not found.')

      return orphanage
      
    } catch (error) {
      throw Error(error.message)
      
    }

  }
}

export default new OrphanageShowService