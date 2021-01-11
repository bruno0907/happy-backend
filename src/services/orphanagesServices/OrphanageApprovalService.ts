import { getRepository } from "typeorm"
import Orphanage from "../../models/Orphanage"


interface OrphanageApprovalProps{
  id: string;
  approved: boolean;
}

class OrphanageApprovalService{
  execute = async({ id, approved }: OrphanageApprovalProps) => {
    const orphanagesRepository = getRepository(Orphanage)

    try {
      const orphanage = await orphanagesRepository.findOne(Number(id)) 
        
      orphanage.approved = approved
  
      await orphanagesRepository.save(orphanage)    
      return 

    } catch (error) {
      throw new Error(error.message)
    }    
  }
}

export default new OrphanageApprovalService