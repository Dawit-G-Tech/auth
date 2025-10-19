import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { RefreshToken } from './refreshToken.model';
import { Role } from './role.model';
import { UserRole } from './userRole.model';

@Table({ tableName: 'Users' })
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @HasMany(() => RefreshToken)
  refreshTokens!: RefreshToken[];

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];
}
