import { getRepository } from 'typeorm'

import Orphanage from '../../models/Orphanage'

class OrphanageIndexService {
  execute = async() => {
    const orphanagesRepository = getRepository(Orphanage)
    
    try {
      const orphanages = await orphanagesRepository.find({
        relations: ['images']
      })

      if(!orphanages) throw new Error('An error has ocurried while fetching orphanages.')
  
      return orphanages
      
    } catch (error) {
      throw Error(error.message)
      
    }

  }
}

export default new OrphanageIndexService