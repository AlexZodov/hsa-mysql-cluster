import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from './config';
import { DatabaseModule } from './common/database';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        typeorm: {
          type: 'mysql',
          replication: {
            master: { url: configService.database.url },
            slaves: configService.database.replicas.map((url) => ({ url })),
          },
        },
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
