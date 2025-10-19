import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserRole } from './userRole.model';

@Table({ tableName: 'Roles' })
export class Role extends Model {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

  @BelongsToMany(() => User, () => UserRole)
  users!: User[];
}
