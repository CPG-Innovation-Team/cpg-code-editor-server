const { ObjectId } = require('mongodb');
const db = require('./mongodb');

const queryProjectList = async ({ _id, hash }) => {
  const projectCollection = db.collection('project_info');
  const queryParam = { available: true };
  if (_id) {
    queryParam._id = ObjectId(_id);
  }
  if (hash) {
    queryParam.hash = hash;
  }
  console.log(queryParam);
  const result = await projectCollection.find(queryParam).toArray();
  return result;
};

const createProject = async (hash, projectName, syntax) => {
  const projectCollection = db.collection('project_info');
  const createTime = Date.now();
  const result = await projectCollection.insertOne({
    hash,
    projectName,
    code: '',
    createTime,
    updateTime: createTime,
    syntax,
    relatedUser: [],
    available: true,
  });
  return result;
};

const updateProject = async (projectId, data) => {
  const projectCollection = db.collection('project_info');
  const updateTime = Date.now();
  const result = await projectCollection.updateOne(
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
  updateProject,
  removeProject,
};
