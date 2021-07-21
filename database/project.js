const db = require('./mongodb');

const queryProjectList = async (projectId) => {
  const projectCollection = db.collection('project');
  const queryParam = { available: true };
  if (projectId) {
    queryParam.id = projectId;
  }
  const result = await projectCollection.find(queryParam).toArray();
  return result;
};

const createProject = async (projectId, projectName, syntax) => {
  const projectCollection = db.collection('project');
  const createTime = Date.now();
  const result = await projectCollection.insertOne({
    id: projectId,
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
  createProject,
  updateProject,
  removeProject,
};
