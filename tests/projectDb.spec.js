const { dbClose } = require('../database/mongodb');

const { dbFindProjectInfo, dbInsertProjectInfo } = require('../database/project');

describe('Project database operation', () => {
  afterAll(async () => {
    await dbClose();
  });

  it('Insert a project into collection then find it', async () => {
    const mockParam = {
      hash: 'hash1',
      projectName: 'Project1',
      code: '',
      syntax: 'javascript',
    };
    const insertResult = await dbInsertProjectInfo(mockParam);
    const findResult = await dbFindProjectInfo({ _id: insertResult.insertedId });

    expect(findResult).toEqual([{ _id: insertResult.insertedId, editInfo: [], ...mockParam }]);
  });
});
