import {config} from 'dotenv'
config()

export const db = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
}

export const port = 3000
export const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const HASH_VALUE = process.env.HSH_VALUE;