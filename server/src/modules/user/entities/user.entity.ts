import { BaseEntity } from 'src/common/entities/base.entity';
import { Folder } from 'src/modules/storage/entities/folder.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserStatus } from '../enums/user-status';
import { File } from 'src/modules/storage/entities/file.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ name: 'first_name' })
    firstName!: string;

    @Column({ name: 'last_name' })
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true, select: false })
    password?: string;

    @Column({ name: 'profile_picture', nullable: true })
    profilePhoto?: string;

    @Column({
        name: 'email_verified',
        default: false,
    })
    emailVerified!: boolean;

    @Column({
        type: 'enum',
        enum: UserStatus,
    })
    status!: UserStatus;

    @Column({
        name: 'storage_used',
        type: 'bigint',
        default: 0,
    })
    storageUsed!: number;

    @OneToOne(() => Folder, (folder) => folder.owner, { nullable: true })
    @JoinColumn({
        name: 'root_folder_id',
    })
    rootFolder!: Folder;

    @OneToMany(() => Folder, (folder) => folder.owner)
    folders!: Folder[];

    @OneToMany(() => File, (file) => file.owner)
    files!: File[];
}
