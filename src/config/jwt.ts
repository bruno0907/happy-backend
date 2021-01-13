import jwt from 'jsonwebtoken'

const _secret = process.env.SECRET_KEY

export const sign = (payload: string | Buffer | object, expiration: number | string) => jwt.sign(payload, _secret, { expiresIn: expiration })
export const verify = (token: string) => jwt.verify(token, _secret)