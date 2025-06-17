import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Tables } from '../migrations/dictionary';
import { ArticleEntity } from './article.entity';

@Table({ tableName: Tables.users })
export class UserEntity extends Model {
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
  public name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  public email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public password: string;

  @HasMany(() => ArticleEntity, {
    as: 'articles',
    foreignKey: 'authorId',
  })
  public articles: ArticleEntity[];
}
