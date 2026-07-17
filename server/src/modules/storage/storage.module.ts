import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';
import { StorageResolver } from './storage.resolver';
import { StorageService } from './services/storage.service';

@Module({
    imports: [TypeOrmModule.forFeature([Folder, File])],
    controllers: [],
    providers: [StorageResolver, StorageService],
})
export class StorageModule {}
