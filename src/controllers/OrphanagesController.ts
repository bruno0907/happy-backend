import { Request, Response } from 'express'
import { getManager, getRepository } from 'typeorm'
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'

import Orphanage from '../models/Orphanage'
import OrphanageImages from '../models/OrphanageImages'

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

    if(!orphanage){
      return res.sendStatus(400)
    }

    return res.status(200).json(orphanageView.render(orphanage))
  }

  store = async (req: Request, res: Response) => {  
    const orphanagesRepository = getRepository(Orphanage)

    const {
      name,
      email,
      password,
      password_verify,
      latitude,
      longitude,
      about,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body

    if(password !== password_verify){
      return res.sendStatus(401)
    }

    // Grava no orphanages_images o filename das imagens que estão sendo upadadas
    const requestImages = req.files as Express.Multer.File[]
    const images = requestImages.map(image => {
      return { 
        path: image.filename 
      }
    })   
    
    const data = {
      name,
      email,
      password,
      latitude,
      longitude,
      about,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    }    
    const schema = Yup.object().shape({
      name: Yup.string().required(),      
      email: Yup.string().required(),
      password: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),      
      about: Yup.string().required().max(300),
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
    
    const orphanage = orphanagesRepository.create(data)  
    await orphanagesRepository.save(orphanage)    
    return res.status(201).json(orphanage)    
  }

  updateOrphanage = async (req: Request, res: Response) => {    
    const orphanagesRepository = getRepository(Orphanage)
    const imagesRepository = getRepository(OrphanageImages)

    const { id } = req.params      

    const {
      name,
      latitude,
      longitude,
      about,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body        

    const requestImages = req.files as Express.Multer.File[]

    const data = {
      id: Number(id),
      name,
      latitude,
      longitude,
      about,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true'       , 
      approved: false,              
    }

    try {      
      const orphanage = await orphanagesRepository.preload(data)

      if(!orphanage){
        return res.status(401).json({ error: 'Orphanage not found.'})
      }            

      const images = requestImages.map(image => {
        return {           
          path: image.filename,
          orphanage
        }
      })   
      
      await getManager().transaction(async orphanagesRepository => {
        await orphanagesRepository.save(orphanage)
        await imagesRepository.save(images)
      })

      // An idea to implement perhaps?
      // sendMail(orphanage.email, message) 
      // Send an email to the adminstrator to let him know that the user made changes to the orphanage

      return res.sendStatus(200)      
      
    } catch (error) {
      return res.status(500).json(error)
    }  
  }

  approveOrphanage = async (req: Request, res: Response) => {  
    const orphanagesRepository = getRepository(Orphanage)

    const {
      approved
    } = req.body 
    
    const { id } = req.params

    try {
      const orphanage = await orphanagesRepository.findOne(id) 

      if(!orphanage){
        return res.status(401).json({ message: 'Orphanage not found.'})
      }
  
      orphanage.approved = approved
  
      await orphanagesRepository.save(orphanage)    
      return res.sendStatus(200)  

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }    
  }
  
  deleteOrphanage = async (req: Request, res: Response) => {
    const orphanagesRepository = getRepository(Orphanage)   
    
    const { id } = req.params   

    try {
      const orphanage = await orphanagesRepository.findOne(id) 
      if(!orphanage){
        return res.status(401).json({ message: 'Orphanage not found.'})
      }

      await orphanagesRepository.remove(orphanage)
    
      return res.sendStatus(200)

    } catch (error) {      
      return res.status(500).json({ error: error.message })
    }
  }  
}

export default new OrphanagesController