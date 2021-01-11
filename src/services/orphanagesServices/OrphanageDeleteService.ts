import { getRepository } from "typeorm"
import Orphanage from "../../models/Orphanage"

interface OrphanageProps{
  id: number;
}

class OrphanageDeleteService{
  execute = async(id: OrphanageProps) => {
    const orphanageRepository = getRepository(Orphanage)

    try {
      const orphanage = await orphanageRepository.findOne(id)

      if(!orphanage) throw new Error('Orphanage not found')
      
      await orphanageRepository.remove(orphanage)
      return

    } catch (error) {
      throw Error(error.message)
    }
  }
}

export default new OrphanageDeleteService