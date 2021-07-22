const stringRandom = require('string-random');
const { ObjectId } = require('mongodb');
const { dbFindProject, dbInsertProject, dbUpdateProject } = require('../database/project');

const queryProjectList = async ({ _id, hash }) => {
  const queryParam = { available: true };
  if (_id) {
    queryParam._id = ObjectId(_id);
  }
  if (hash) {
    queryParam.hash = hash;
  }
  const result = await dbFindProject(queryParam);
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

const createProject = async (projectName, syntax) => {
  const hash = await generateProjectHashCode();
  const createTime = Date.now();
  const result = await dbInsertProject({
    hash,
    projectName,
    code: '',
    createTime,
    updateTime: createTime,
    syntax,
    available: true,
  });
  return result;
};

const updateProject = async (projectId, data) => {
  const updateTime = Date.now();
  const result = await dbUpdateProject(
    { _id: ObjectId(projectId) },
    {
      updateTime,
      ...data,
    },
  );
  return result;
};

const removeProject = (projectId) => updateProject(projectId, { available: false });

module.exports = {
  queryProjectList,
  createProject,
  removeProject,
};
