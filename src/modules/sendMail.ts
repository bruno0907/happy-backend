import * as nodemailer from 'nodemailer'

interface Email{
  name: string;
  email: string;
  subject: string;
  message: string;    
  link?: string;
}

interface EmailProps{  
  name: string;
  email: string;
  subject: string;
  message: string;  
  link?: string;
}

class Email{
  constructor({name, email, subject, message, link}: EmailProps){

    this.name = name
    this.email = email
    this.subject = subject
    this.message = message    
    this.link = link
  }

  send(){
    try {        
      const transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        }
      })

      transport.verify(error => {
        if(error) throw new Error('Cannot connect to the email service')
      })

      const data = {
        from: 'Happy - Admin <noreply@happy.io>',
        to: this.email,
        subject: this.subject,        
        html: `    
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Proffy - Recuperação de senha</title>
              <style>
                body {
                  background: linear-gradient(329.54deg, #29B6D1 0%, #00C7C7 100%);
                  color: #FFFFFF;
                  font-family: Sans-serif;  
                  padding: 22px;
                }
                h1 {
                  font-size: 48px;
                  margin: 10px 0
                }
                h2 {
                  font-size: 24px;
                }
                p {
                  font-size: 14px;
                  font-weight: bold;
                  line-height: 22px;
                }
                a {
                  text-decoration: none;
                  color: #FFF;
                }
                div {
                  margin: 44px 0;
                }
                span {              
                  padding: 12px 24px;
                  background: #12D4E0;                
                  font-size: 24px;
                  font-weight: bold;      
                  border-radius: 8px;          
                }          
              </style>
            </head>
            <body>                 
              <h1>Happy!</h1>
              <h2>Olá  ${ this.name }!</h2>
              <p>${ this.message }</p>
              ${ this.link ?
                `<div>                  
                  <a href="${ this.link }" target="_blank" rel="noopnener noreferrer"><span>Clique aqui</span>                  
                </div>` :
                null
              }
            </body>
          </html>  
        `        
      }    

      transport.sendMail(data, error => {    
    
        if(error){      
          throw new Error('An error has ocurried while sending the email.')
        }     
        return
      })

    } catch (error) {
      throw Error(error.message)
    }
  }
}

export default Email