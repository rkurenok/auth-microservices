import { Column, DataType, Table, Model } from "sequelize-typescript";

interface ProfileCreationAttr {
    name: string,
    surname: string,
    patronymic: string,
    phone: string,
    userId: number
}

@Table({ tableName: 'profile' })
export class Profile extends Model<Profile, ProfileCreationAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    surname: string;

    @Column({ type: DataType.STRING, allowNull: false })
    patronymic: string;

    @Column({ type: DataType.STRING, allowNull: false })
    phone: string;

    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    userId: number;
}