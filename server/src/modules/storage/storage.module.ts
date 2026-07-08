import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Folder, File])],
    controllers: [],
    providers: [],
})
export class StorageModule {}
