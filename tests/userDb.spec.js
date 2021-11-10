const { dbConnect, dbClose } = require('../database/mongodb');
const { dbInsertUser, dbUpdateUser, userCollection } = require('../database/user');

describe('User database operation', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    dbClose();
  });

  beforeEach(async () => {
    await userCollection().deleteMany({});
  });

  it('Insert a user into collection then find it', async () => {
    const mockParam = { userName: 'Grace', avatar: 'img-001.jpg' };
    const insertResult = await dbInsertUser(mockParam);
    const findResult = await userCollection().find({ _id: insertResult.insertedId }).toArray();

    expect(findResult).toEqual([{ _id: insertResult.insertedId, ...mockParam }]);
  });

  it('Insert a user and update name then find the updated user', async () => {
    const mockParam = { userName: 'Grace', avatar: 'img-001.jpg' };
    const insertResult = await dbInsertUser(mockParam);
    await dbUpdateUser({ _id: insertResult.insertedId }, { userName: 'Tony' });
    const findResult = await userCollection().find({ _id: insertResult.insertedId }).toArray();

    expect(findResult).toEqual([{ _id: insertResult.insertedId, ...mockParam, userName: 'Tony' }]);
  });
});
