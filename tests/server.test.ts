import app from '../src/app';
import mongoose from 'mongoose';
import request from 'supertest';
import User from '../src/models/user.model';
import 'dotenv/config';

const DB: string = process.env
  .DATABASE_URL!.replace('<db_username>', process.env.DATABASE_USERNAME!)
  .replace('<db_password>', process.env.DATABASE_PASSWORD!);

beforeAll(() => {
  mongoose.connect(DB);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clear the database after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe('User API', () => {
  const data = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    password: '123',
    role: 'user',
  };

  test('GET /api/users', async () => {
    const testUser = await User.create(data);

    await request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
        expect(response.body.results).toEqual(1);
        expect(response.body.data.users[0]).toMatchObject({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          role: 'user',
        });
      });
  });

  test('GET /api/users/:id', async () => {
    const testUser = await User.create(data);

    await request(app)
      .get(`/api/users/${testUser.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
        expect(response.body.data.user._id).toBe(testUser.id);
        expect(response.body.data.user).toMatchObject({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          role: 'user',
        });
      });
  });

  test('POST /api/users', async () => {
    await request(app)
      .post('/api/users')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success');
        expect(response.body.data.user).toMatchObject(data);

        // Check data in the database
        const user = await User.findOne({ _id: response.body.data.user._id });
        expect(user).toBeTruthy();
        expect(user).toMatchObject({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          role: 'user',
        });
      });
  });

  test('PATCH /api/users/:id', async () => {
    const testUser = await User.create(data);

    await request(app)
      .patch(`/api/users/${testUser.id}`)
      .send({ firstName: 'Jane' })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success');
        expect(response.body.data.user.firstName).toBe('Jane');

        // Check data in the database
        const user = await User.findOne({ _id: response.body.data.user._id });
        expect(user).toBeTruthy();
        expect(user).toMatchObject({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'test@example.com',
          role: 'user',
        });
      });
  });

  test('DELETE /api/users/:id', async () => {
    const testUser = await User.create(data);

    await request(app).delete(`/api/users/${testUser.id}`).expect(204);
  });
});
