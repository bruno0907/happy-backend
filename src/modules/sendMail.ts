import * as nodemailer from 'nodemailer'

interface UserDataProps{  
  name: string;
  email: string;
  token: string;
}

export const sendEmail = ({name, email, token}: UserDataProps) => {  
  const route = 'http://localhost:3000/app/new-password?key='

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
      console.log('Server is no go!')      
      throw new Error('Cannot connect to the mail server')

    } else {
      console.log('Server is ready to go')      
    }
  })

  //Disparo do email
  transport.sendMail({
    from: 'Happy - Admin <noreply@happy.io>',
    to: email,
    subject: 'Solicitação de redefinição de senha da plataforma Happy',    
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
                font-size: 36px;
              }
              p {
                font-size: 16px;
                line-height: 22px;
              }
              div {
                margin: 44px 0;
              }
              span {              
                padding: 12px 24px;
                background: #FFFF;
                color: #32264D;
                font-size: 24px;
                font-weight: bold;                
              }          
            </style>
          </head>
          <body>                  
            <h1>Olá  ${name}!</h1>
            <p>Então você esqueceu sua senha? Não tem problema! Clique no link abaixo e você será redirecionado para redefinir sua senha.</p>
            <div>
              <a href="${route}${token}" target="_blank" rel="noopnener noreferrer"><span>Clique aqui</span>
            </div> 
          </body>
      </html>  
    `    
  }, error => {    

    if(error){
      console.log('Redefinition email cannot be sent')    
      console.log(error.message)  
      return {
        status: 'Error',
        statusCode: 400
      }
    } 

    console.log('Success! Redefinition email sent successfully!!')
    return {
      status: 'Success',
      statusCode: 200
    }
        
  })    
}

// export default sendEmail