const { dbClose } = require('../database/mongodb');

const {
  dbFindProjectInfo,
  dbInsertProjectInfo,
  dbUpdateProjectInfo,
  dbFindProjectEdit,
  dbInsertProjectEdit,
  dbUpdateProjectEdit,
  projectInfoCollection,
  projectEditCollection,
} = require('../database/project');
const { userCollection } = require('../database/user');

describe('Project database operation', () => {
  afterAll(async () => {
    await dbClose();
  });

  beforeEach(async () => {
    await projectInfoCollection.deleteMany({});
    await projectEditCollection.deleteMany({});
    await userCollection.deleteMany({});
  });

  it('Insert a project into collection then find it', async () => {
    const mockParam = { hash: 'hash1', projectName: 'Project1', code: '', syntax: 'javascript', available: true };
    const insertResult = await dbInsertProjectInfo(mockParam);
    const findResult = await dbFindProjectInfo({ _id: insertResult.insertedId });

    expect(findResult).toEqual([{ _id: insertResult.insertedId, editInfo: [], ...mockParam }]);
  });

  it('Insert 3 projects into collection then find them', async () => {
    const mockParam1 = { hash: 'hash1', projectName: 'Project1', code: '', syntax: 'javascript', available: true };
    const mockParam2 = { hash: 'hash2', projectName: 'Project2', code: '', syntax: 'javascript', available: true };
    const mockParam3 = { hash: 'hash3', projectName: 'Project3', code: '', syntax: 'javascript', available: true };
    const insertResult1 = await dbInsertProjectInfo(mockParam1);
    const insertResult2 = await dbInsertProjectInfo(mockParam2);
    const insertResult3 = await dbInsertProjectInfo(mockParam3);
    const findResult = await dbFindProjectInfo({});

    expect(findResult).toEqual([
      { _id: insertResult1.insertedId, editInfo: [], ...mockParam1 },
      { _id: insertResult2.insertedId, editInfo: [], ...mockParam2 },
      { _id: insertResult3.insertedId, editInfo: [], ...mockParam3 },
    ]);
  });

  it('Insert a project and update syntax then find the updated project', async () => {
    const mockParam = { hash: 'hash1', projectName: 'Project1', code: '', syntax: 'javascript', available: true };
    const insertResult = await dbInsertProjectInfo(mockParam);
    await dbUpdateProjectInfo({ _id: insertResult.insertedId }, { syntax: 'go' });
    const findResult = await dbFindProjectInfo({ _id: insertResult.insertedId });

    expect(findResult).toEqual([{ _id: insertResult.insertedId, editInfo: [], ...mockParam, syntax: 'go' }]);
  });

  it('Insert a project edit info with user info into collection then query the same project with user info', async () => {
    const mockUserParam = { userName: 'Grace', avatar: 'img-001.jpg' };
    const insertUserResult = await userCollection.insertOne(mockUserParam);

    const mockProjectEditParam = { projectId: 'project001', userId: insertUserResult.insertedId };
    await dbInsertProjectEdit(mockProjectEditParam);
    const findResult = await dbFindProjectEdit(mockProjectEditParam);

    expect(findResult).toMatchObject([{ ...mockProjectEditParam, ...mockUserParam }]);
  });

  it('Insert a project edit info with user info into collection then query the same project with user info', async () => {
    const mockUserParam = { userName: 'Grace', avatar: 'img-001.jpg', isOnline: true };
    const insertUserResult = await userCollection.insertOne(mockUserParam);

    const mockProjectEditParam = { projectId: 'project001', userId: insertUserResult.insertedId };
    await dbInsertProjectEdit(mockProjectEditParam);
    const findResult = await dbFindProjectEdit(mockProjectEditParam);

    expect(findResult).toMatchObject([{ ...mockProjectEditParam, ...mockUserParam }]);
  });

  it('Insert a project edit info with user info into collection and update online status then query the updated record', async () => {
    const mockUserParam = { userName: 'Grace', avatar: 'img-001.jpg', isOnline: true };
    const insertUserResult = await userCollection.insertOne(mockUserParam);

    const mockProjectEditParam = { projectId: 'project001', userId: insertUserResult.insertedId };
    await dbInsertProjectEdit(mockProjectEditParam);
    await dbUpdateProjectEdit(mockProjectEditParam, { isOnline: false });
    const findResult = await dbFindProjectEdit(mockProjectEditParam);

    expect(findResult).toMatchObject([{ ...mockProjectEditParam, ...mockUserParam, isOnline: false }]);
  });
});
