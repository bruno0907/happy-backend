import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Orphanage from '../models/Orphanage'

class OrphanagesPasswordController{
  index = async (req: Request, res: Response) => {
    const orphanagesRepository = getRepository(Orphanage)

    const { email } = req.body

    const orphanage = await orphanagesRepository.find({ where: { email }})

    if(!orphanage){
      return res.sendStatus(401)
    }

    // Adicionar envio de email de recuperação com o link para a tela pro usuário cadastrar nova senha
    return res.sendStatus(200)
    
  }

  update = async (req: Request, res: Response) => {      
    const {      
      email,
      password,
      password_verify      
    } = req.body    

    const data = {      
      email,
      password,
      password_verify
    }
    
    const schema = Yup.object().shape({        
      email: Yup.string().required(),
      password: Yup.string().required(),
      password_verify: Yup.string().required()
    })

    await schema.validate(data, {
      abortEarly: false,
    })  

    if(password !== password_verify){
      return res.sendStatus(401)
    }      
    
    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = await orphanagesRepository.findOne({ where: { email }})
    orphanage.password = password
    await orphanagesRepository.save(orphanage)

    res.sendStatus(200)
  }
  
}

export default new OrphanagesPasswordController