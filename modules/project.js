const stringRandom = require('string-random');
const { ObjectId } = require('mongodb');
const {
  dbFindProjectInfo,
  dbInsertProjectInfo,
  dbUpdateProjectInfo,
  dbInsertProjectEdit,
} = require('../database/project');

const queryProjectList = async ({ _id, hash }) => {
  const queryParam = { available: true };
  if (_id) {
    queryParam._id = ObjectId(_id);
  }
  if (hash) {
    queryParam.hash = hash;
  }
  const result = await dbFindProjectInfo(queryParam);
  return result;
};

const generateProjectHashCode = async () => {
  const hash = stringRandom(5);
  const projectExist = await queryProjectList({ hash });

  return new Promise((resolve) => {
    if (projectExist.length > 0) {
      resolve(generateProjectHashCode());
    } else {
      resolve(hash);
    }
  });
};

const createProject = async (userId, projectName, syntax) => {
  const hash = await generateProjectHashCode();
  const createTime = Date.now();
  const insertProjectInfoResult = await dbInsertProjectInfo({
    hash,
    projectName,
    code: '',
    createTime,
    updateTime: createTime,
    syntax,
    available: true,
    createUser: userId,
  });
  if (insertProjectInfoResult.acknowledged) {
    const insertProjectEditResult = await dbInsertProjectEdit({
      projectId: insertProjectInfoResult.insertedId,
      relatedUser: [
        {
          userId: ObjectId(userId),
          isOnline: true,
          isEditing: false,
        },
      ],
    });

    if (insertProjectEditResult.acknowledged) {
      const queryResult = await queryProjectList({ _id: insertProjectInfoResult.insertedId });
      return { success: true, data: queryResult };
    }
    return { success: false };
  }
  return { success: false };
};

const updateProject = async (projectId, data) => {
  const updateTime = Date.now();
  const result = await dbUpdateProjectInfo({ _id: ObjectId(projectId) }, { updateTime, ...data });
  return { success: result.acknowledged };
};

const removeProject = (projectId) => updateProject(projectId, { available: false });

module.exports = {
  queryProjectList,
  createProject,
  updateProject,
  removeProject,
};
