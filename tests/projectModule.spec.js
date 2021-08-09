const { dbClose } = require('../database/mongodb');

const { queryProjectList, createProject, updateProject, removeProject } = require('../modules/project');
const { projectInfoCollection, projectEditCollection } = require('../database/project');
const { userCollection } = require('../database/user');

describe('Project module', () => {
  afterAll(async () => {
    await dbClose();
  });

  beforeEach(async () => {
    await projectInfoCollection.deleteMany({});
    await projectEditCollection.deleteMany({});
    await userCollection.deleteMany({});
  });

  it('Create a project then get the correct query result with edit info', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createdProjectId = createProjectResult.data[0]._id;
    const queryResult = await queryProjectList({ _id: createdProjectId });

    expect(queryResult).toMatchObject([
      {
        _id: createdProjectId,
        projectName: 'Project1',
        code: '',
        syntax: 'javascript',
        available: true,
        createUser: insertUserResult.insertedId,
        isTop: false,
        editInfo: [
          {
            userId: insertUserResult.insertedId,
            userName: 'Grace',
            avatar: 'img-001.jpg',
            isEditing: false,
            isOnline: true,
          },
        ],
      },
    ]);

    expect(queryResult[0]).toHaveProperty('hash');
    expect(queryResult[0].createTime).toEqual(queryResult[0].updateTime);
  });

  it('Create 3 projects then get the correct query result', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult1 = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createProjectResult2 = await createProject(insertUserResult.insertedId, 'Project2', 'javascript');
    const createProjectResult3 = await createProject(insertUserResult.insertedId, 'Project3', 'javascript');

    const findResult = await queryProjectList({});

    const expectedProjectData = {
      code: '',
      syntax: 'javascript',
      available: true,
      createUser: insertUserResult.insertedId,
      isTop: false,
    };

    expect(findResult).toMatchObject([
      { _id: createProjectResult1.data[0]._id, projectName: 'Project1', ...expectedProjectData },
      { _id: createProjectResult2.data[0]._id, projectName: 'Project2', ...expectedProjectData },
      { _id: createProjectResult3.data[0]._id, projectName: 'Project3', ...expectedProjectData },
    ]);
  });

  it('Create a project and update syntax then get the correct updated query result', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createdProjectId = createProjectResult.data[0]._id;

    await updateProject(createdProjectId, { syntax: 'go' });
    const queryResult = await queryProjectList({ _id: createdProjectId });

    expect(queryResult).toMatchObject([
      {
        _id: createdProjectId,
        projectName: 'Project1',
        code: '',
        syntax: 'go',
        available: true,
        createUser: insertUserResult.insertedId,
        isTop: false,
        editInfo: [
          {
            userId: insertUserResult.insertedId,
            userName: 'Grace',
            avatar: 'img-001.jpg',
            isEditing: false,
            isOnline: true,
          },
        ],
      },
    ]);

    expect(queryResult[0]).toHaveProperty('hash');
    expect(queryResult[0]).toHaveProperty('createTime');
    expect(queryResult[0]).toHaveProperty('updateTime');
  });

  it('Create a project and remove it then get the correct result in both query and database record', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createdProjectId = createProjectResult.data[0]._id;

    await removeProject(createdProjectId.toString());
    const queryResult = await queryProjectList({ _id: createdProjectId });
    const dbFindResult = await projectInfoCollection.find({ _id: createdProjectId }).toArray();

    expect(queryResult).toEqual([]);

    expect(dbFindResult).toMatchObject([
      {
        _id: createdProjectId,
        projectName: 'Project1',
        code: '',
        syntax: 'javascript',
        available: false,
        createUser: insertUserResult.insertedId,
        isTop: false,
      },
    ]);
    expect(dbFindResult[0]).toHaveProperty('hash');
    expect(dbFindResult[0]).toHaveProperty('createTime');
    expect(dbFindResult[0]).toHaveProperty('updateTime');
  });
});
