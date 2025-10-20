import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { RefreshToken } from './refreshToken.model';
import { Role } from './role.model';

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

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: true })
  roleId?: number;

  @BelongsTo(() => Role)
  role?: Role;
}
