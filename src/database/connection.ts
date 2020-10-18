import { createConnection } from 'typeorm'

createConnection()
  .then(() => {console.log('Database connection is ON')})
  .catch(error => console.log('Database connection Error', error.message))