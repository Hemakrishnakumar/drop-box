import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Folder } from './folder.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Index(['owner'])
@Index(['folder'])
@Unique(['folder', 'owner', 'name'])
@Entity('files')
export class File extends BaseEntity {
    @Column()
    name!: string;

    @Column()
    extension!: string;

    @Column({ type: 'bigint' })
    size!: number;

    @Column({ name: 'mime_type' })
    mimeType!: string;

    @ManyToOne(() => Folder, (folder) => folder.files, { nullable: false })
    @JoinColumn({ name: 'folder_id' })
    folder!: Folder;

    @ManyToOne(() => User, (user) => user.files, { nullable: false })
    @JoinColumn({
        name: 'owner_id',
    })
    owner!: User;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt?: Date;
}
