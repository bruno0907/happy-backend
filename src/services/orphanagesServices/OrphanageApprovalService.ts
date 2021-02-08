import { getRepository } from "typeorm"
import Orphanage from "../../models/Orphanage"

interface OrphanageProps{
  id: number;
  approved: boolean;
}

class OrphanageApprovalService{
  execute = async({ id, approved }: OrphanageProps) => {
    const orphanagesRepository = getRepository(Orphanage)

    try {
      const orphanage = await orphanagesRepository.findOne(id)

      if(!orphanage) throw new Error('Orphanage not found')

      orphanage.approved = approved

      await orphanagesRepository?.save(orphanage)    
      return

    } catch (error) {
      throw Error(error.message)
    }    
  }
}

export default new OrphanageApprovalService