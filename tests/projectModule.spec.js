const { dbClose } = require('../database/mongodb');

const {
  queryProjectList,
  createProject,
  updateProject,
  removeProject,
  modifyProjectEditStatus,
  saveClientProjectUpdateAndEmit,
} = require('../modules/project');
const { projectInfoCollection, projectEditCollection } = require('../database/project');
const { userCollection } = require('../database/user');

const expectProjectQueryResult = (projectId, userId) => ({
  _id: projectId,
  projectName: 'Project1',
  code: '',
  syntax: 'javascript',
  available: true,
  createUser: userId,
  isTop: false,
  editInfo: [
    {
      userId,
      userName: 'Grace',
      avatar: 'img-001.jpg',
      isEditing: false,
      isOnline: true,
    },
  ],
});

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

    expect(queryResult).toMatchObject([expectProjectQueryResult(createdProjectId, insertUserResult.insertedId)]);

    expect(queryResult[0]).toHaveProperty('hash');
    expect(queryResult[0].createTime).toEqual(queryResult[0].updateTime);
  });

  it('Create 5 projects and top the second project then get the correct query result with correct sequency', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult1 = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createProjectResult2 = await createProject(insertUserResult.insertedId, 'Project2', 'javascript');
    const createProjectResult3 = await createProject(insertUserResult.insertedId, 'Project3', 'javascript');
    const createProjectResult4 = await createProject(insertUserResult.insertedId, 'Project4', 'javascript');
    const createProjectResult5 = await createProject(insertUserResult.insertedId, 'Project5', 'javascript');

    await updateProject(createProjectResult2.data[0]._id, { isTop: true });

    const findResult = await queryProjectList({});

    const expectedProjectData = {
      code: '',
      syntax: 'javascript',
      available: true,
      createUser: insertUserResult.insertedId,
      isTop: false,
    };

    expect(findResult).toMatchObject([
      { _id: createProjectResult2.data[0]._id, projectName: 'Project2', ...expectedProjectData, isTop: true },
      { _id: createProjectResult5.data[0]._id, projectName: 'Project5', ...expectedProjectData },
      { _id: createProjectResult4.data[0]._id, projectName: 'Project4', ...expectedProjectData },
      { _id: createProjectResult3.data[0]._id, projectName: 'Project3', ...expectedProjectData },
      { _id: createProjectResult1.data[0]._id, projectName: 'Project1', ...expectedProjectData },
    ]);
  });

  it('Create a project and update syntax then get the correct updated query result', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createdProjectId = createProjectResult.data[0]._id;

    await updateProject(createdProjectId, { syntax: 'go' });
    const queryResult = await queryProjectList({ _id: createdProjectId });

    expect(queryResult).toMatchObject([
      { ...expectProjectQueryResult(createdProjectId, insertUserResult.insertedId), syntax: 'go' },
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

  it('Create a project and modify edit status then get the correct query result', async () => {
    const insertUserResult1 = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });
    const insertUserResult2 = await userCollection.insertOne({ userName: 'Tony', avatar: 'img-002.jpg' });

    const createProjectResult = await createProject(insertUserResult1.insertedId, 'Project1', 'javascript');
    const createdProjectId = createProjectResult.data[0]._id;

    await modifyProjectEditStatus(createdProjectId, insertUserResult2.insertedId, { isOnline: true, isEditing: false });
    const queryResult1 = await queryProjectList({ _id: createdProjectId });

    expect(queryResult1).toMatchObject([
      {
        ...expectProjectQueryResult(createdProjectId, insertUserResult1.insertedId),
        editInfo: [
          {
            userId: insertUserResult1.insertedId,
            userName: 'Grace',
            avatar: 'img-001.jpg',
            isEditing: false,
            isOnline: true,
          },
          {
            userId: insertUserResult2.insertedId,
            userName: 'Tony',
            avatar: 'img-002.jpg',
            isEditing: false,
            isOnline: true,
          },
        ],
      },
    ]);

    await modifyProjectEditStatus(createdProjectId, insertUserResult2.insertedId, { isOnline: true, isEditing: true });
    const queryResult2 = await queryProjectList({ _id: createdProjectId });

    expect(queryResult2).toMatchObject([
      {
        ...expectProjectQueryResult(createdProjectId, insertUserResult1.insertedId),
        editInfo: [
          {
            userId: insertUserResult1.insertedId,
            userName: 'Grace',
            avatar: 'img-001.jpg',
            isEditing: false,
            isOnline: true,
          },
          {
            userId: insertUserResult2.insertedId,
            userName: 'Tony',
            avatar: 'img-002.jpg',
            isEditing: true,
            isOnline: true,
          },
        ],
      },
    ]);
  });

  it('Client update project info, expect update project info in database and return correct emit data', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createdProjectId = createProjectResult.data[0]._id;

    const updateParam = {
      projectName: 'Project1',
      code: 'TEST_CODE',
      syntax: 'sql',
    };

    const emitObject = await saveClientProjectUpdateAndEmit({
      ...updateParam,
      projectId: createdProjectId,
      userId: insertUserResult.insertedId,
    });
    const dbFindResult = await projectInfoCollection.find({ _id: createdProjectId }).toArray();

    expect(dbFindResult).toMatchObject([{ ...updateParam, _id: createdProjectId }]);
    expect(emitObject).toEqual({ ...updateParam, projectId: createdProjectId });
  });

  it('Client update user edit info of project, expect update project edit info in database and return correct emit data', async () => {
    const insertUserResult = await userCollection.insertOne({ userName: 'Grace', avatar: 'img-001.jpg' });

    const createProjectResult = await createProject(insertUserResult.insertedId, 'Project1', 'javascript');
    const createdProjectId = createProjectResult.data[0]._id;

    const updateParam = {
      projectId: createdProjectId,
      userId: insertUserResult.insertedId,
      isOnline: true,
      isEditing: true,
      currentCursor: { lineNumber: 3, column: 10 },
    };

    const emitObject = await saveClientProjectUpdateAndEmit(updateParam);
    const dbFindResult = await projectEditCollection
      .find({ projectId: createdProjectId, userId: insertUserResult.insertedId })
      .toArray();

    expect(dbFindResult).toMatchObject([updateParam]);
    expect(emitObject).toEqual(updateParam);
  });
});
