import { getRepository } from "typeorm"
import Orphanage from "../models/Orphanage"

class OrphanageShowService {
  execute = async({ id  }) => {
    const orphanagesRepository = getRepository(Orphanage)    
    
    const orphanage = await orphanagesRepository.findOne(id, {
      relations: ['images']
    })    

    if(!orphanage) return null

    return orphanage
  }
}

export default new OrphanageShowService