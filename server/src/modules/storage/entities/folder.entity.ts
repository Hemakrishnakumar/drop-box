import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { File } from './file.entity';

@Entity('folders')
export class Folder extends BaseEntity {
    @Column()
    name!: string;

    @ManyToOne(() => User, (user) => user.folders)
    @JoinColumn({
        name: 'owner_id',
    })
    owner!: User;

    @ManyToOne(() => Folder, (folder) => folder.children)
    @JoinColumn({ name: 'parent_folder_id' })
    parentFolder?: Folder;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        nullable: true,
    })
    deletedAt?: Date;

    @OneToMany(() => Folder, (folder) => folder.parentFolder)
    children!: Folder[];

    @OneToMany(() => File, (file) => file.folder)
    files!: File[];
}
