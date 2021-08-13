const stringRandom = require('string-random');
const { ObjectId } = require('mongodb');
const {
  dbFindProjectInfo,
  dbInsertProjectInfo,
  dbUpdateProjectInfo,
  dbFindProjectEdit,
  dbInsertProjectEdit,
  dbUpdateProjectEdit,
} = require('../database/project');

const queryProjectList = async ({ _id, hash }) => {
  const queryParam = { available: true };
  if (_id) {
    queryParam._id = ObjectId(_id);
  }
  if (hash) {
    queryParam.hash = hash;
  }
  const result = await dbFindProjectInfo(queryParam);

  if (result.length > 0 && (queryParam._id || queryParam.hash)) {
    result[0].editInfo = await dbFindProjectEdit({ projectId: result[0]._id });
  }
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

const createProject = async (userId, projectName, syntax) => {
  const hash = await generateProjectHashCode();
  const createTime = Date.now();
  const insertProjectInfoResult = await dbInsertProjectInfo({
    hash,
    projectName,
    code: '',
    createTime,
    updateTime: createTime,
    syntax,
    available: true,
    createUser: userId,
    isTop: false,
  });
  if (insertProjectInfoResult.acknowledged) {
    const insertProjectEditResult = await dbInsertProjectEdit({
      projectId: insertProjectInfoResult.insertedId,
      userId: ObjectId(userId),
      isOnline: true,
      isEditing: false,
      currentCursor: null,
    });

    if (insertProjectEditResult.acknowledged) {
      const queryResult = await queryProjectList({ _id: insertProjectInfoResult.insertedId });
      return { success: true, data: queryResult };
    }
    return { success: false };
  }
  return { success: false };
};

const updateProject = async (projectId, data) => {
  const updateTime = Date.now();
  const result = await dbUpdateProjectInfo({ _id: ObjectId(projectId) }, { updateTime, ...data });
  return { success: result.acknowledged };
};

const removeProject = (projectId) => updateProject(projectId, { available: false });

const modifyProjectEditStatus = async (projectId, userId, data) => {
  const queryResult = await dbFindProjectEdit({ projectId: ObjectId(projectId), userId: ObjectId(userId) });
  if (queryResult && queryResult.length > 0) {
    const updateResult = await dbUpdateProjectEdit(
      { projectId: ObjectId(projectId), userId: ObjectId(userId) },
      { ...data }
    );
    return { success: updateResult.acknowledged };
  }
  const insertResult = await dbInsertProjectEdit({
    projectId: ObjectId(projectId),
    userId: ObjectId(userId),
    ...data,
  });
  return { soccess: insertResult.acknowledged };
};

const saveClientProjectUpdateAndEmit = async (param) => {
  const { projectId, projectName, code, syntax, userId, isOnline, isEditing, currentCursor } = param;
  if (projectName || code || syntax) {
    await updateProject(projectId, { projectName, code, syntax, userId });
    await modifyProjectEditStatus(projectId, userId, { isEditing: false });
    return { projectId, projectName, code, syntax };
  }
  if (isOnline || isEditing || currentCursor) {
    const updateData = { isOnline, isEditing, currentCursor };
    if (isOnline === false) {
      updateData.socketId = null;
    }
    await modifyProjectEditStatus(projectId, userId, updateData);
    return { projectId, userId, isOnline, isEditing, currentCursor };
  }
  return null;
};

const clientEnterProject = async (projectId, userId, socketId) => {
  modifyProjectEditStatus(projectId, userId, { isOnline: true, socketId });
  const projectInfo = await queryProjectList({ _id: projectId });
  return {
    projectId,
    code: projectInfo[0].code,
    editUser: {
      userId,
      isOnline: true,
    },
  };
};

module.exports = {
  queryProjectList,
  createProject,
  updateProject,
  removeProject,
  modifyProjectEditStatus,
  saveClientProjectUpdateAndEmit,
  clientEnterProject,
};
