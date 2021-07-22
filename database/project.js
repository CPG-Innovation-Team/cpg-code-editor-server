const db = require('./mongodb');

const COLLECTION_PROJECT_INFO = 'project_info';

const dbFindProject = async (param) => {
  const projectCollection = db.collection(COLLECTION_PROJECT_INFO);
  const result = await projectCollection.find(param).toArray();
  return result;
};

const dbInsertProject = async (param) => {
  const projectCollection = db.collection(COLLECTION_PROJECT_INFO);
  const result = await projectCollection.insertOne({ ...param });
  return result;
};

const dbUpdateProject = async (queryParam, data) => {
  const projectCollection = db.collection(COLLECTION_PROJECT_INFO);
  const result = await projectCollection.updateOne(queryParam, data);
  return result;
};

module.exports = {
  dbFindProject,
  dbInsertProject,
  dbUpdateProject,
};
