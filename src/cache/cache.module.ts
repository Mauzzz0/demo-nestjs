import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { RedisClientType } from '@redis/client';
import { REDIS, redisProvider } from './cache.provider';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService, redisProvider],
  exports: [CacheService, redisProvider],
})
export class CacheModule implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS)
    private readonly redis: RedisClientType,
  ) {}

  /**
   * Gracefully Shutdown
   */
  async onApplicationShutdown() {
    await this.redis.close();

    this.redis.destroy();
  }
}
