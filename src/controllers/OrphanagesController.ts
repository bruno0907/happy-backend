import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'

import Orphanage from '../models/Orphanage'

class OrphanagesController{
  index = async (req: Request, res: Response) => {
    const orphanagesRepository = getRepository(Orphanage)

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    return res.status(200).json(orphanageView.renderMany(orphanages))
  }

  show = async (req: Request, res: Response) => {
    const orphanagesRepository = getRepository(Orphanage)
    const { id } = req.params
    
    const orphanage = await orphanagesRepository.findOne(id, {
      relations: ['images']
    })    

    return res.status(200).json(orphanageView.render(orphanage))
  }

  store = async (req: Request, res: Response) => {  
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body
  
    const orphanagesRepository = getRepository(Orphanage)

    const requestImages = req.files as Express.Multer.File[]
    const images = requestImages.map(image => {
      return { 
        path: image.filename 
      }
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),      
      about: Yup.string().required().max(300),
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
  
    const orphanage = orphanagesRepository.create(data)
  
    await orphanagesRepository.save(orphanage)    

    return res.status(201).json(orphanage)
  }

  delete = async (req: Request, res: Response) => {
    const orphanagesRepository = getRepository(Orphanage)   
    
    const { id } = req.params

    const orphanage = await orphanagesRepository.findOne({ where: { id }})  

    
    return res.status(200).json(orphanage)
  }
}

export default new OrphanagesController