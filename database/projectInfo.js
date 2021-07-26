const db = require('./mongodb');

const projectInfoCollection = db.collection('project_info');

const dbFindProjectInfo = async (param) => {
  const result = await projectInfoCollection.find(param).toArray();
  return result;
};

const dbInsertProjectInfo = async (param) => {
  const result = await projectInfoCollection.insertOne({ ...param });
  return result;
};

const dbUpdateProjectInfo = async (queryParam, data) => {
  const result = await projectInfoCollection.updateOne(queryParam, { $set: data });
  return result;
};

module.exports = {
  dbFindProjectInfo,
  dbInsertProjectInfo,
  dbUpdateProjectInfo,
};
