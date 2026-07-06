import * as Joi from 'joi';

export default Joi.object({
    PORT: Joi.number().required(),

    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),

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
