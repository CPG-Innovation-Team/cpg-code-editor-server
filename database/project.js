const db = require('./mongodb');

const projectCollection = db.collection('project_info');

const dbFindProject = async (param) => {
  const result = await projectCollection.find(param).toArray();
  return result;
};

const dbInsertProject = async (param) => {
  const result = await projectCollection.insertOne({ ...param });
  return result;
};

const dbUpdateProject = async (queryParam, data) => {
  const result = await projectCollection.updateOne(queryParam, { $set: data });
  return result;
};

module.exports = {
  dbFindProject,
  dbInsertProject,
  dbUpdateProject,
};
