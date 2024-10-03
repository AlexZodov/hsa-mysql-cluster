import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

type DatabaseModuleOptions = {
  typeorm: {
    type: 'mysql';
    url?: string;
    replication?: {
      master: { url: string };
      slaves: Array<{ url: string }>;
    };
  };
};

type DatabaseModuleAsyncOptions = {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => DatabaseModuleOptions;
};

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: options.typeorm.type,
          url: options.typeorm.url,
          replication: options.typeorm.replication,
          autoLoadEntities: true,
          insecureAuth: true,
          connectorPackage: 'mysql2',
        }),
      ],
    };
  }

  static forRootAsync(asyncOptions: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ...(asyncOptions.imports || []),
        TypeOrmModule.forRootAsync({
          inject: asyncOptions.inject,
          useFactory: async (...args) => {
            const options = asyncOptions.useFactory(...args);
            return {
              type: options.typeorm.type,
              url: options.typeorm.url,
              replication: options.typeorm.replication,
              autoLoadEntities: true,
              insecureAuth: true,
              connectorPackage: 'mysql2',
            };
          },
        }),
      ],
    };
  }
}
