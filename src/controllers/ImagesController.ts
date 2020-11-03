import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import OrphanageImages from '../models/OrphanageImages'
import Orphanage from '../models/Orphanage'

class ImagesController{
  // Method created for possible future use perhaps
  storeOrphanageImage = async (req: Request, res: Response) => {    
    const orphanageRepository = getRepository(Orphanage)
    const imagesRepository = getRepository(OrphanageImages)
    
    const { id } = req.params  
    const {filename: path} = req.file
    const orphanage = await orphanageRepository.findOne(id)

    try {
      if(!orphanage){
        return res.send(401).json({ message: 'Orphanage not found'})
      }

      const image = imagesRepository.create({
        path,
        orphanage
      })
  
      await imagesRepository.save(image)

      return res.sendStatus(200)

    } catch (error) {
      return res.status(500).json(error)
    }
  }

  removeOrphanageImage = async (req: Request, res: Response) => {
    const imagesRepository = getRepository(OrphanageImages)   
    
    const { id } = req.params
    
    try {      
      const image = await imagesRepository.findOne(id) 

      if(!image){
        return res.status(401).json({ message: 'Image not found.'})
      }

      await imagesRepository.remove(image)
    
      return res.sendStatus(200)

    } catch (error) {      
      return res.status(500).json({
        error: error.message        
      })
      
    }
  }
  
}

export default new ImagesController