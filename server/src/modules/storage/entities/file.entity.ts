import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Folder } from './folder.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('files')
export class File extends BaseEntity {
    @Column()
    name!: string;

    @Column()
    extension!: string;

    @Column()
    size!: number;

    @Column({ name: 'mime_type' })
    mimeType!: string;

    @ManyToOne(() => Folder, (folder) => folder.files)
    @JoinColumn({ name: 'folder_id' })
    folder!: Folder;

    @ManyToOne(() => User, (user) => user.files)
    @JoinColumn({
        name: 'owner_id',
    })
    owner!: User;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
