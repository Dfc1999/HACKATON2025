import { Module, Global } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          const uri = process.env.MONGO_URI;
          if (!uri) throw new Error('MONGO_URI no está definido en .env');

          const client = new MongoClient(uri);
          await client.connect();
          console.log('✅ Conexión a MongoDB Exitosa');

          return client.db('RRHH');
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
