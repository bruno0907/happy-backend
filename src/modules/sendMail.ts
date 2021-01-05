import * as nodemailer from 'nodemailer'

interface UserDataProps{  
  name: string;
  email: string;
  subject: string;
  message: string;
  token?: string;
  link: string;
}

export const sendEmail = (
  {
    name, 
    email, 
    subject, 
    message,
    token, 
    link
  }: UserDataProps) => {  

  // Config do client SMTP
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '9757190fb2f423',
      pass: 'ce0d0a685a8138',
    },
  })

  transport.verify(error => {
    if(error){         
      throw new Error('Cannot connect to the mail server')
    }
  })

  //Disparo do email
  transport.sendMail({
    from: 'Happy - Admin <noreply@happy.io>',
    to: email,
    subject: subject,    
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
            <h2>Olá  ${name}!</h2>
            <p>${message}</p>
            <div>
              ${token ? 
                `<a href="${link}${token}" target="_blank" rel="noopnener noreferrer"><span>Clique aqui</span>`
               : 
                `<a href="${link}" target="_blank" rel="noopnener noreferrer"><span>Clique aqui</span>`
              }
            </div> 
          </body>
      </html>  
    `        
  }, error => {    

    if(error){      
      return {
        status: 'Error',
        statusCode: 400
      }
    }     
    return {
      status: 'Success',
      statusCode: 200
    }
        
  })    
}