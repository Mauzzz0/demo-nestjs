import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Tables } from '../migrations/dictionary';
import { UserEntity } from './user.entity';

@Table({ tableName: Tables.articles })
export class ArticleEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  public id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public description: string;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public authorId: number;

  @BelongsTo(() => UserEntity, {
    as: 'author',
    foreignKey: 'authorId',
  })
  public author: UserEntity;
}
