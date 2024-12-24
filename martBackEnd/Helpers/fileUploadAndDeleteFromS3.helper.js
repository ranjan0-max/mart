const { uploadFile, getTempUrl, s3Delete } = require("./s3Aws.helper");
const helperName = "fileUploadAndDelete";

const upLoadFile = async (request, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = await uploadFile(request.body.file, `${name}Documment`);
      const url = await getTempUrl(fileName);
      resolve({ url, fileName });
    } catch (error) {
      Logger.error(error.message + "at upLoadFile function " + helperName);
      reject(error);
    }
  });
};

const deleteFile = async (fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileDeleted = await s3Delete(fileName);
      resolve(fileDeleted);
    } catch (error) {
      Logger.error(error.message + "at deleteFile function " + helperName);
      reject(error);
    }
  });
};

module.exports = {
  upLoadFile,
  deleteFile,
};
