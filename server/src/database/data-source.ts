import 'dotenv/config';

import { File } from '../modules/storage/entities/file.entity';
import { Folder } from '../modules/storage/entities/folder.entity';
import { User } from '../modules/user/entities/user.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [File, User, Folder],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});
