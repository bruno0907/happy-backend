import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import OrphanageImages from '../models/OrphanageImages'

class ImagesController{
  deleteImage = async (req: Request, res: Response) => {
    const imagesRepository = getRepository(OrphanageImages)   
    
    const { id } = req.params
    
    try {
      
      const image = await imagesRepository.findOne(id) 
      if(!image){
        return res.status(401).json({ message: 'Image not found or invalid id.'})
      }

      await imagesRepository.remove(image)
    
    return res.sendStatus(200)
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({
        error: error.message        
      })
    }
  }
  
}

export default new ImagesController