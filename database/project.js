const db = require('./mongodb');

const projectInfoCollection = db.collection('project_info');
const projectEditCollection = db.collection('project_edit_info');

const dbFindProjectInfo = async (param) => {
  const result = await projectInfoCollection
    .aggregate([
      { $match: param },
      {
        $lookup: {
          from: 'project_edit_info',
          localField: '_id',
          foreignField: 'projectId',
          as: 'editInfo',
        },
      },
    ])
    .toArray();
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

const dbFindProjectEdit = async (param) => {
  const result = await projectEditCollection.find(param);
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
  dbFindProjectInfo,
  dbInsertProjectInfo,
  dbUpdateProjectInfo,
  dbFindProjectEdit,
  dbInsertProjectEdit,
  dbUpdateProjectEdit,
};
