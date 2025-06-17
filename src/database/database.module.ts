import { Global, Module } from '@nestjs/common';
import { entityProviders, sequelizeProvider } from './sequelize.providers';

@Global()
@Module({
  providers: [sequelizeProvider, ...entityProviders],
  exports: [sequelizeProvider, ...entityProviders],
})
export class DatabaseModule {}
