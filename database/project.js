const db = require('./mongodb');

const queryProjectList = async () => {
  const projectCollection = db.collection('project');
  const result = await projectCollection.find({}).toArray();
  return result;
};

const queryProjectById = async (projectId) => {
  const projectCollection = db.collection('project');
  const result = await projectCollection.find({ id: projectId }).toArray();
  return result;
};

const createProject = async (projectId, productName, syntax) => {
  const projectCollection = db.collection('project');
  const createTime = Date.now();
  const result = await projectCollection.insertOne({
    id: projectId,
    productName,
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
  const projectCollection = db.collection('project');
  const updateTime = Date.now();
  const result = await projectCollection.updateOne(
    { id: projectId },
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
  queryProjectById,
  createProject,
  updateProject,
  removeProject,
};
