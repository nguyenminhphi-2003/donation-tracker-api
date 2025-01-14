import app from '../src/app';
import mongoose from 'mongoose';
import request from 'supertest';
import User from '../src/models/user.model';
import Activity from '../src/models/activity.model';
import Donation from '../src/models/donation.model';
import 'dotenv/config';
import exp from 'constants';

const DB: string = process.env
  .DATABASE_URL!.replace('<db_username>', process.env.DATABASE_USERNAME!)
  .replace('<db_password>', process.env.DATABASE_PASSWORD!);

beforeAll(() => {
  mongoose.connect(DB);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the database after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

const userSampleData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  password: '123',
  role: 'user',
};

const activitySampleData = {
  name: 'Activity 1',
  description: 'Lorem ipsum',
  goalAmount: 1000,
  totalDonations: 0,
  status: 'open',
  end_at: new Date().toJSON(),
};

describe('User API', () => {
  test('GET /api/users', async () => {
    const testUser = await User.create(userSampleData);

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
    const testUser = await User.create(userSampleData);

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
      .send(userSampleData)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success');
        expect(response.body.data.user).toMatchObject(userSampleData);

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
    const testUser = await User.create(userSampleData);

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
    const testUser = await User.create(userSampleData);

    await request(app).delete(`/api/users/${testUser.id}`).expect(204);
  });
});

describe('Activity API', () => {
  test('GET /api/activities', async () => {
    const user = await User.create(userSampleData);
    const activity = await Activity.create({
      creator: user.id,
      ...activitySampleData,
    });

    await request(app)
      .get('/api/activities')
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
        expect(response.body.results).toEqual(1);
        expect(response.body.data.activities[0]).toMatchObject(
          activitySampleData,
        );
      });
  });

  test('GET /api/activities/:id', async () => {
    const user = await User.create(userSampleData);
    const activity = await Activity.create({
      creator: user.id,
      ...activitySampleData,
    });

    await request(app)
      .get(`/api/activities/${activity.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.data.activity).toBeTruthy();
        expect(response.body.data.activity.name).toBe('Activity 1');
        expect(response.body.data.activity.description).toBe('Lorem ipsum');
        expect(response.body.data.activity.goalAmount).toBe(1000);
        expect(response.body.data.activity.totalDonations).toBe(0);
        expect(response.body.data.activity.status).toBe('open');
        expect(response.body.data.activity.end_at).toEqual(
          activity.end_at.toJSON(),
        );
      });
  });

  test('POST /api/activities', async () => {
    const user = await User.create(userSampleData);
    const activity = {
      creator: user.id,
      ...activitySampleData,
    };

    await request(app)
      .post('/api/activities')
      .send(activity)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success');
        expect(response.body.data.activity).toMatchObject(activity);

        // Check data in the database
        const checkingActivity = await Activity.findOne({
          _id: response.body.data.activity._id,
        });
        const checkingUser = await User.findOne({
          _id: checkingActivity?.creator,
        });
        expect(checkingActivity).toBeTruthy();
        expect(checkingUser).toBeTruthy();
        expect(checkingActivity?.name).toBe('Activity 1');
        expect(checkingActivity?.description).toBe('Lorem ipsum');
        expect(checkingActivity?.goalAmount).toBe(1000);
        expect(checkingActivity?.totalDonations).toBe(0);
        expect(checkingActivity?.status).toBe('open');
        expect(checkingActivity?.end_at.toISOString()).toEqual(activity.end_at);
      });
  });

  test('PATCH /api/activities/:id', async () => {
    const user = await User.create(userSampleData);
    const testActivity = await Activity.create({
      creator: user.id,
      ...activitySampleData,
    });

    await request(app)
      .patch(`/api/activities/${testActivity.id}`)
      .send({ name: 'Activity 2' })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success');
        expect(response.body.data.activity).toBeTruthy();
        expect(response.body.data.activity.name).toBe('Activity 2');
        expect(response.body.data.activity.description).toBe('Lorem ipsum');
        expect(response.body.data.activity.goalAmount).toBe(1000);
        expect(response.body.data.activity.totalDonations).toBe(0);
        expect(response.body.data.activity.status).toBe('open');
        expect(response.body.data.activity.end_at).toEqual(
          testActivity.end_at.toJSON(),
        );

        // Check data in the database
        const checkingActivity = await Activity.findOne({
          _id: response.body.data.activity._id,
        });
        const checkingUser = await User.findOne({
          _id: checkingActivity?.creator,
        });
        expect(checkingActivity).toBeTruthy();
        expect(checkingUser).toBeTruthy();
        expect(checkingActivity?.name).toBe('Activity 2');
        expect(checkingActivity?.description).toBe('Lorem ipsum');
        expect(checkingActivity?.goalAmount).toBe(1000);
        expect(checkingActivity?.totalDonations).toBe(0);
        expect(checkingActivity?.status).toBe('open');
        expect(checkingActivity?.end_at).toEqual(testActivity.end_at);
      });
  });

  test('DELETE /api/activities/:id', async () => {
    const user = await User.create(userSampleData);
    const activity = await Activity.create({
      creator: user.id,
      ...activitySampleData,
    });

    await request(app).delete(`/api/activities/${activity.id}`).expect(204);
  });
});

describe('Donation API', () => {
  test('GET /api/donations', async () => {
    const user = await User.create(userSampleData);
    const activity = await Activity.create({
      creator: user.id,
      ...activitySampleData,
    });

    const donation = await Donation.create({
      user: user.id,
      activity: activity.id,
      amount: 100,
    });

    await request(app)
      .get('/api/donations')
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
        expect(response.body.results).toEqual(1);
        expect(response.body.data.donations[0].user._id).toBe(user.id);
      });
  });

  test('GET /api/donations/:id', async () => {
    const user = await User.create(userSampleData);
    const activity = await Activity.create({
      creator: user.id,
      ...activitySampleData,
    });

    const donation = await Donation.create({
      user: user.id,
      activity: activity.id,
      amount: 100,
    });

    await request(app)
      .get(`/api/donations/${donation.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe('success');
        expect(response.body.data.donation.user._id).toBe(user.id);
        expect(response.body.data.donation.activity._id).toBe(activity.id);
        expect(response.body.data.donation.amount).toBe(100);
      });
  });

  test('POST /api/donations', async () => {
    const user = await User.create(userSampleData);
    const activity = await Activity.create({
      creator: user.id,
      ...activitySampleData,
    });
    const donation = {
      user: user._id,
      activity: activity._id,
      amount: 100,
    };

    await request(app)
      .post('/api/donations')
      .send(donation)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('success');
        const createdDonation = response.body.data.donation[0];
        expect(createdDonation.user).toBe(user.id);
      });
  });
});
