import { getRepository } from 'typeorm'
import * as jwt from '../../config/jwt'

import Orphanage from '../../models/Orphanage'

class OrphanageAuthService{
  execute = async({id, token}: any) => {
    try {
      const response = jwt.verify(token)
  
      const orphanageRepository = getRepository(Orphanage)
      const orphanage = await orphanageRepository.findOne(id)

      if(!orphanage) throw new Error('Orphanage not found')
      if(orphanage?.token !== token) throw new Error('Invalid orphanage token.')

      return response
    } catch (error) {
      throw Error(error.message)
    }
  }
}
export default new OrphanageAuthService