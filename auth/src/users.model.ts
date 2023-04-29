import { Column, DataType, Table, Model } from "sequelize-typescript";

interface UserCreationAttr {
    email: string,
    password: string
}

@Table({ tableName: 'users' })
export class Users extends Model<Users, UserCreationAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;
}