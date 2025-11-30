import { Injectable, Inject } from '@nestjs/common';
import { Db } from 'mongodb';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  async create(user: User): Promise<User> {
    const collection = this.db.collection<User>('Users');
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = { ...user, password: hashedPassword };
    const result = await collection.insertOne(newUser);

    const { password, ...resultUser } = newUser;
    return { ...resultUser, _id: result.insertedId.toString() } as any;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.collection<User>('Users').findOne({ email });
  }

  async updateOrganization(userId: string, orgId: string) {
    const { ObjectId } = require('mongodb');
    return this.db.collection<User>('Users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { organizationId: orgId } }
    );
  }
}
