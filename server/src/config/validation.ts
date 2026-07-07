import * as Joi from 'joi';

export default Joi.object({
    PORT: Joi.number().required().default(5000),

    DB_HOST: Joi.string().required().default('localhost'),
    DB_PORT: Joi.number().required().default(5434),
    DB_USERNAME: Joi.string().required().default('admin'),
    DB_PASSWORD: Joi.string().required().default('admin'),
    DB_NAME: Joi.string().required().default('dropbox'),

    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),

    MINIO_ENDPOINT: Joi.string().required(),
    MINIO_PORT: Joi.number().required(),
    MINIO_ACCESS_KEY: Joi.string().required(),
    MINIO_SECRET_KEY: Joi.string().required(),
    MINIO_BUCKET: Joi.string().required(),

    SESSION_SECRET: Joi.string().required(),
    SESSION_TTL: Joi.number().required(),
});
