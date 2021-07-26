const db = require('./mongodb');

const projectEditCollection = db.collection('project_edit_info');

const dbFindProjectEdit = async (param) => {
  const result = await projectEditCollection.find(param).toArray();
  return result;
};

const dbInsertProjectEdit = async (param) => {
  const result = await projectEditCollection.insertOne({ ...param });
  return result;
};

const dbUpdateProjectEdit = async (queryParam, data) => {
  const result = await projectEditCollection.updateOne(queryParam, { $set: data });
  return result;
};

module.exports = {
  dbFindProjectEdit,
  dbInsertProjectEdit,
  dbUpdateProjectEdit,
};
