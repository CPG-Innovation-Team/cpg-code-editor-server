const { dbClose } = require('../database/mongodb');

const {
  dbFindProjectInfo,
  dbInsertProjectInfo,
  dbUpdateProjectInfo,
  projectInfoCollection,
} = require('../database/project');

describe('Project database operation', () => {
  afterAll(async () => {
    await dbClose();
  });

  beforeEach(async () => {
    await projectInfoCollection.deleteMany({});
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
});
