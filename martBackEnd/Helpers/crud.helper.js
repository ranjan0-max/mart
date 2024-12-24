/**
 *
 * @param {array of keys ["key_one", "key_two", ...]} keys
 * @param { data object [{ key_one: 'data', key_two: 0, key_three: 'more data'},...]} data
 */

function removeKeys(keys, data) {
  let dataArray;
  if (data instanceof Array) {
    dataArray = data;
  } else {
    dataArray = [data];
  }
  let newDataArray = dataArray.map((item) => {
    keys.filter((key) => {
      if (key == "_id") {
        item.id = item[key];
      }
      if (item.hasOwnProperty(key)) {
        delete item[key];
      }
    });
    return item;
  });
  return newDataArray;
}

/**
 * @description finds if the provided email is unique
 * @param model mongoose user model
 * @param email string: email provided by user
 * @returns object: { success: boolean, error: boolean || error }
 */
async function isUnique(Model, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await Model.count(data);
      if (count > 0) {
        let error = new Error("Data exists !");
        error.name = "NON_UNIQUE";
        error.resCode = 400;
        reject(error);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function getCount(Model, query = {}) {
  try {
    const count = await Model.count(query);
    return count;
  } catch (error) {
    return error;
  }
}
/**
 * @description finds if the provided email is unique
 * @param model mongoose model
 * @param data object: data object that to be created
 * @returns object: { success: boolean, error: boolean || error }
 */
async function create(Model, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataModel = new Model(data);
      let savedData = await dataModel.save();
      savedData = removeKeys(["_id", "__v"], savedData);
      resolve(savedData);
    } catch (error) {
      reject(error);
    }
  });
}

// -=-=-=-=-=-=-=-=- create many queries in one time -=-=-=-=-=-=-=-=-=-=-

async function createMany(Model, dataArray) {
  return new Promise(async (resolve, reject) => {
    try {
      const createdDocuments = await Model.insertMany(dataArray);
      resolve(createdDocuments);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description reads data based on query and model
 * @param Model mongoose model
 * @param query object: data query eg: { email: user@email.com}
 * @param pagination optional: object: { skip: 10, limit: 20 }
 * @param exclude optional: object: { password: 0, __v: 0 }
 * @returns  object: { data: array of objects || error: object }
 */
async function read(Model, query, pagination = false, exclude = {}, sort = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await Model.find(query, exclude)
        .limit(pagination?.limit || 10)
        .skip(pagination?.skip || 0)
        .sort(sort)
        .lean();
      data = removeKeys(["_id", "__v"], data);
      resolve(data);
    } catch (error) {
      console.log(error);

      reject(error);
    }
  });
}

/**
 * @description reads data based on query and model
 * @param Model mongoose model
 * @param query object: data query eg: { email: user@email.com}
 * @param exclude optional: object: { password: 0, __v: 0 }
 * @param sort optional: object: { createAt: -1 }
 * @returns  object: { data: array of objects || error: object }
 */
async function readOne(Model, query, exclude = {}, sort = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await Model.findOne(query, exclude).sort(sort).lean();
      // data = removeKeys(["_id", "__v"], data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description updates data based on query and model
 * @param Model mongoose model
 * @param data object: {query: { field_to_match: value }, data: { field_to_update: value, ... }}
 * @returns  object: { boolean || error: object }
 */
async function update(Model, data) {
  return new Promise(async (resolve, reject) => {
    try {
      await Model.findByIdAndUpdate(data.query._id, data.data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function CustomUpdate(Model, data) {
  return new Promise(async (resolve, reject) => {
    try {
      await Model.updateOne(data.query, {
        $set: data.data,
      });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateOne(Model, data) {
  return new Promise(async (resolve, reject) => {
    try {
      await Model.updateOne(data.query, data.data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateMany(Model, data) {
  return new Promise(async (resolve, reject) => {
    try {
      await Model.updateMany(data.query, data.data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description deletes data based on query and model
 * @param Model mongoose model
 * @param data object: { field_to_match: value }
 * @returns  object: { boolean || error: object }
 */
async function remove(Model, data) {
  return new Promise(async (resolve, reject) => {
    try {
      await Model.deleteOne(data);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function aggregation(Model, pipeline) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await Model.aggregate(pipeline, { allowDiskUse: true });
      data = removeKeys(["__v"], data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description reads data based on query and model with population
 * @param Model mongoose model
 * @param query object: data query eg: {queryString: { email: user@email.com }, popString: key, queryExclude: { key: 0 || 1 }, popExclude: { key: 1 || 0} }
 * @param pagination optional: object: { skip: 10, limit: 20 }
 * @returns  object: { data: array of objects || error: object }
 */

async function population(Model, query, pagination = false) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await Model.find(query.queryString, query?.queryExclude || {})
        .populate(query.popString, query?.popExclude || {})
        .populate(query.nestedPop || "")
        .limit(pagination?.limit || 100)
        .skip(pagination?.skip || 0)
        .sort(query?.sort || {})
        .lean();
      data = removeKeys(["_id", "__v"], data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

async function findDetails(Model, query) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Model.find(query, query?.queryExclude || {});
      resolve(data);
    } catch (error) {
      const newErr = new Error("Unable to get details");
      newErr.error = error;
      newErr.code = 401;
      reject(newErr);
    }
  });
}

async function findDetailsWithSelectedField(Model, query) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Model.find(query.conditions || {}).select(
        query.projection || {}
      );

      resolve(data);
    } catch (error) {
      const newErr = new Error("Unable to get details");
      newErr.error = error;
      newErr.code = 401;
      reject(newErr);
    }
  });
}

async function findLastRecord(Model, query = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const lastRecord = await Model.findOne(query).sort({ _id: -1 });
      resolve(lastRecord);
    } catch (error) {
      const newErr = new Error("Unable to get the last record");
      newErr.error = error;
      newErr.code = 401;
      reject(newErr);
    }
  });
}

module.exports = {
  isUnique,
  getCount,
  read,
  readOne,
  create,
  update,
  updateMany,
  remove,
  aggregation,
  population,
  findDetails,
  CustomUpdate,
  updateOne,
  findDetailsWithSelectedField,
  createMany,
  findLastRecord,
};
