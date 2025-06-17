import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, ArticleModule],
})
export class AppModule {}
