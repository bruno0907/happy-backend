import { getManager, getRepository } from 'typeorm'
import * as Yup from 'yup'

import Orphanage from '../../models/Orphanage'
import OrphanageImages from '../../models/OrphanageImages'

interface UpdateOrphanageProps{
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  email: string;
  whatsapp: number;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  approved: boolean;
}

class OrphanageUpdateService {
  execute = async(
    data: UpdateOrphanageProps, 
    requestImages: Express.Multer.File[]
  ) => {
    
    const orphanagesRepository = getRepository(Orphanage)
    const imagesRepository = getRepository(OrphanageImages)

    const orphanage = await orphanagesRepository.preload(data)

    const images = requestImages.map(image => {
      return {           
        path: image.filename,
        orphanage
      }
    })   

    const schema = Yup.object().shape({
      name: Yup.string().required(),  
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),      
      about: Yup.string().required().max(300),
      email: Yup.string().email().required(),
      whatsapp: Yup.number().required(),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    })

    await schema.validate(data, {
      abortEarly: false,      
    })

    try {
      await getManager().transaction(
        async orphanagesRepository => {
          await orphanagesRepository.save(orphanage)
          await imagesRepository.save(images)
        }
      )
      return
      
    } catch (error) {
      throw new Error(error.message)
    }  

    // try {      
    //   const orphanage = await orphanagesRepository.preload(data)

    //   if(!orphanage){
    //     return res.status(401).json({ error: 'Orphanage not found.'})
    //   }            

    //   const images = requestImages.map(image => {
    //     return {           
    //       path: image.filename,
    //       orphanage
    //     }
    //   })   
      
    //   await getManager().transaction(async orphanagesRepository => {
    //     await orphanagesRepository.save(orphanage)
    //     await imagesRepository.save(images)
    //   })

    //   // An idea to implement perhaps?
    //   // sendMail(orphanage.email, message) 
    //   // Send an email to the adminstrator to let him know that the user made changes to the orphanage
    //   // This requires refactor the email module

    //   return res.sendStatus(200)      
      
    // } catch (error) {
    //   return res.status(500).json(error)
    // }  
    
  }
}

export default new OrphanageUpdateService