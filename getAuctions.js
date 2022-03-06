const uuid = require("uuid").v4;
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");
const httpEventNormalizer = require("@middy/http-event-normalizer");
const httpErrorHandler = require("@middy/http-error-handler");
const createError = require("http-errors");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getAuctions = async function (event, context) {
  let auctions;

  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

      auctions = result.Items;

  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

exports.handler = middy(getAuctions)
  .use(httpJSONBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
