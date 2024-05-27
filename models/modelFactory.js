const userModel = require('./userModel');
const lawsuitModel = require('./lawsuitModel');
const receiptModel = require('./receiptModel');

const models = {
  user: userModel,
  lawsuit: lawsuitModel,
  receipt: receiptModel,
};

const getModel = (modelName) => {
  return models[modelName];
};

module.exports = { getModel };
