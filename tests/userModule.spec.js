const { dbConnect, dbClose } = require('../database/mongodb');
const { userCollection } = require('../database/user');
const { createUser, updateUser } = require('../modules/user');

describe('User module', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await dbClose();
  });

  beforeEach(async () => {
    await userCollection().deleteMany({});
  });

  it('Create user and find it in collection', async () => {
    const insertResult = await createUser('Grace', 'img-001.jpg');
    const findResult = await userCollection().find({ _id: insertResult.userId }).toArray();

    expect(findResult).toMatchObject([{ _id: insertResult.userId, userName: 'Grace', avatar: 'img-001.jpg' }]);
  });

  it('Create user and update user name then find the updated user in collection', async () => {
    const insertResult = await createUser('Grace', 'img-001.jpg');
    await updateUser(insertResult.userId, 'Tony', 'img-001.jpg');
    const findResult = await userCollection().find({ _id: insertResult.userId }).toArray();

    expect(findResult).toMatchObject([{ _id: insertResult.userId, userName: 'Tony', avatar: 'img-001.jpg' }]);
  });
});
