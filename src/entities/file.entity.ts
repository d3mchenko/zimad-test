import {Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({ name: 'files' })
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileNameInSystem: string

    @Column({ nullable: true })
    extension: string;

    @Column()
    name: string;

    @Column()
    mimeType: string;

    @Column()
    size: number;

    @UpdateDateColumn()
    uploadDate: Date;
}