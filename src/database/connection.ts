import { createConnection } from 'typeorm'

createConnection()
  .then(() => console.log('Database connection is ON'))
  .catch(error => console.error({
    Message: 'Database connection Error', 
    Error: error.message
  }))