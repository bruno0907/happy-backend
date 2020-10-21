import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'

import { verify } from 'jsonwebtoken'

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

  approveOrphanage = async (req: Request, res: Response) => {  
    const orphanagesRepository = getRepository(Orphanage)

    const {
      approved
    } = req.body 
    
    const { id } = req.params

    const { authorization } = req.headers

    const token = authorization.replace('Bearer', '').trim()
    if(!token){
      return res.status(401).json({ message: 'Token is missing.'})
    }    
    
    const isValidToken = verify(token, process.env.SECRET_KEY)
    if(!isValidToken){
      return res.status(401).json({ message: 'Invalid Token.'})
    }

    const orphanage = await orphanagesRepository.findOne(id) 
    if(!orphanage){
      return res.status(401).json({ message: 'Orphanage not found or invalid id.'})
    }

    orphanage.approved = approved

    await orphanagesRepository.save(orphanage)    
    return res.sendStatus(200)
  }
  
  deleteOrphanage = async (req: Request, res: Response) => {
    const orphanagesRepository = getRepository(Orphanage)   
    
    const { id } = req.params

    const { authorization } = req.headers

    const token = authorization.replace('Bearer', '').trim()
    if(!token){
      return res.status(401).json({ message: 'Token is missing.'})
    }    
    
    const isValidToken = verify(token, process.env.SECRET_KEY)
    if(!isValidToken){
      return res.status(401).json({ message: 'Invalid Token.'})
    }

    const orphanage = await orphanagesRepository.findOne(id) 
    if(!orphanage){
      return res.status(401).json({ message: 'Orphanage not found or invalid id.'})
    }

    await orphanagesRepository.remove(orphanage)
    
    return res.sendStatus(200)
  }
  
}

export default new OrphanagesController