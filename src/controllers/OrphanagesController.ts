import { Request, Response } from 'express'
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'

import OrphanagesIndexService from '../services/orphanagesServices/OrphanagesIndexService'
import OrphanageShowService from '../services/orphanagesServices/OrphanageShowService'
import OrphanageStoreService from '../services/orphanagesServices/OrphanageStoreService'
import OrphanageUpdateService from '../services/orphanagesServices/OrphanageUpdateService'
import OrphanageApprovalService from '../services/orphanagesServices/OrphanageApprovalService'
import OrphanageRejectionService from '../services/orphanagesServices/OrphanageRejectionService'
import OrphanageDeleteService from '../services/orphanagesServices/OrphanageDeleteService'

class OrphanagesController{
  index = async (req: Request, res: Response) => {
    try {
      const orphanages = await OrphanagesIndexService.execute()
      return res.status(200).json(orphanageView.renderMany(orphanages))

    } catch (error) {
      return res.status(400).json({ 
        status: 400,
        error: error.message 
      })

    }
  }

  show = async (req: Request, res: Response) => {
    const data = req.params
    const id = Number(data.id)    

    try{
      const orphanage = await OrphanageShowService.execute({ id })                
      return res.status(200).json(orphanageView.render(orphanage))

    }catch(error){
      return res.status(404).json({
        status: 404,
        message: error.message
      })

    }  

  }

  store = async (req: Request, res: Response) => {  
    const {
      name,      
      latitude,
      longitude,
      about,
      email, 
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body

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
      email,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    }   

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
      const orphanage = OrphanageStoreService.execute(data)      
      return res.status(200).json(orphanage)
      
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      })
    }
    
  }

  updateOrphanage = async (req: Request, res: Response) => {    
    const { id } = req.params      

    const {
      name,
      latitude,
      longitude,
      about,
      email,
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
      email,
      whatsapp,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true', 
      approved: false,              
    }  

    try {
      await OrphanageUpdateService.execute(data, requestImages)  
      return res.sendStatus(200)
      
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      })

    }
    
  }

  approveOrphanage = async (req: Request, res: Response) => {  
    const {
      approved
    } = req.body 
      
    const data = req.params    
    const id = Number(data.id)

    try {
      await OrphanageApprovalService.execute({id, approved})   
      return res.sendStatus(200)
      
    } catch (error) {
      return res.status(400).json({ 
        status: 400,
        error: error.message 
      })
    }    
  }

  rejectOrphanage = async (req: Request, res: Response) => {  
    const { id } = req.params

    try {
      await OrphanageRejectionService.execute(id)
      return res.sendStatus(200)      

    } catch (error) {
      return res.status(404).json({ 
        status: 404,
        error: error.message 
      })

    }  

  }
  
  deleteOrphanage = async (req: Request, res: Response) => {        
    const data = req.params   
    const id = Number(data.id)

    try {  
      await OrphanageDeleteService.execute({ id })     
      return res.sendStatus(200)

    } catch (error) {      
      return res.status(400).json({ 
        status: 400,
        error: error.message 
      })
    }
  }  
}

export default new OrphanagesController