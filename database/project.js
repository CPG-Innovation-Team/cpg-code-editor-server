const { getDB } = require('./mongodb');

const projectInfoCollection = () => {
  return getDB().collection('project_info');
};
const projectEditCollection = () => {
  return getDB().collection('project_edit_info');
};

const dbFindProjectInfo = async (param) =>
  projectInfoCollection()
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
      { $sort: { isTop: -1, updateTime: -1 } },
    ])
    .toArray();

const dbInsertProjectInfo = async (param) => projectInfoCollection().insertOne({ ...param });

const dbUpdateProjectInfo = async (queryParam, data) => projectInfoCollection().updateOne(queryParam, { $set: data });

// editing db will be done here in the future
const dbUpdateProjectCode = async (queryParam, data) => {
  projectInfoCollection().updateOne(queryParam, { $push: { projectCode: { $each: data.codeUpdate } } });
};
const dbFindProjectEdit = async (param) =>
  projectEditCollection()
    .aggregate([
      { $match: param },
      {
        $lookup: {
          from: 'user_info',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$userInfo', 0] }, '$$ROOT'] } },
      },
      {
        $project: { userInfo: 0 },
      },
    ])
    .toArray();

const dbInsertProjectEdit = async (param) => projectEditCollection().insertOne({ ...param });

const dbUpdateProjectEdit = async (queryParam, data) => projectEditCollection().updateOne(queryParam, { $set: data });

module.exports = {
  dbFindProjectInfo,
  dbInsertProjectInfo,
  dbUpdateProjectInfo,
  dbFindProjectEdit,
  dbInsertProjectEdit,
  dbUpdateProjectEdit,
  dbUpdateProjectCode,
  projectInfoCollection,
  projectEditCollection,
};
