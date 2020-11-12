import jwt from 'jsonwebtoken'

const _secret = process.env.SECRET_KEY

export const sign = payload => jwt.sign(payload, _secret, { expiresIn: 86400})
export const verify = token => jwt.verify(token, _secret)