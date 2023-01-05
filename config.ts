import dotenv from 'dotenv';
// config .env
dotenv.config({ path: './.env' });

const PORT = process.env.API_PORT || 4000;
export const config = {
    API_PORT: +PORT,
    API_URL: process.env.API_URL+':'+PORT,
    REACT_APP_URL: process.env.REACT_APP_URL,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_SECRET_KEY+""
}