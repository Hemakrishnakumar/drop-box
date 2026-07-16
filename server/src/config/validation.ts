import * as Joi from 'joi';

export default Joi.object({
    NODE_ENV: Joi.string().default('development'),
    PORT: Joi.number().required().default(5000),
    APP_URL: Joi.string().uri(),
    ENABLE_EMAIL_VERIFICATION: Joi.boolean().required().default(true),
    EMAIL_VERIFICATION_TOKEN_SECRET: Joi.string(),

    DB_HOST: Joi.string().required().default('localhost'),
    DB_PORT: Joi.number().required().default(5434),
    DB_USERNAME: Joi.string().required().default('admin'),
    DB_PASSWORD: Joi.string().required().default('admin'),
    DB_NAME: Joi.string().required().default('dropbox'),

    REDIS_HOST: Joi.string().required().default('localhost'),
    REDIS_PORT: Joi.number().required().default(6379),

    MINIO_ENDPOINT: Joi.string().required(),
    MINIO_PORT: Joi.number().required(),
    MINIO_ACCESS_KEY: Joi.string().required(),
    MINIO_SECRET_KEY: Joi.string().required(),
    MINIO_BUCKET: Joi.string().required(),

    SESSION_SECRET: Joi.string().required(),
    SESSION_TTL: Joi.number().required(),

    NODEMAILER_HOST: Joi.string(),
    NODEMAILER_PORT: Joi.number(),
    GMAIL_APP_USER: Joi.string(),
    GMAIL_APP_PASSWORD: Joi.string(),
    SESSION_EXPIRATION_IN_HOURS: Joi.number().required().default(24),
});
