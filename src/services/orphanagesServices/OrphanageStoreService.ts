import { getRepository } from 'typeorm'

import Orphanage from '../../models/Orphanage'

interface OrphanageProps{
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  email: string;
  whatsapp: number;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    path: string;
  }>;
}

class OrphanageStoreService {
  execute = async(data: OrphanageProps) => {
    const orphanagesRepository = getRepository(Orphanage)  
    
    try{      
      const orphanage = orphanagesRepository.create(data)
      await orphanagesRepository.save(data)
      return orphanage

    } catch(error){      
      throw new Error(error.message)

    }     
    
  }
}

export default new OrphanageStoreService