import { getRepository } from 'typeorm'

import Orphanage from '../models/Orphanage'

class OrphanageIndexService {
  execute = async() => {
    const orphanagesRepository = getRepository(Orphanage)

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    return orphanages
  }
}

export default new OrphanageIndexService