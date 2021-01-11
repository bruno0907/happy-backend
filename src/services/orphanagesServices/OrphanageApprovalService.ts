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
      orphanage.approved = approved

      await orphanagesRepository.save(orphanage)    
      return

    } catch (error) {
      throw Error('Orphanage not found.')
    }    
  }
}

export default new OrphanageApprovalService