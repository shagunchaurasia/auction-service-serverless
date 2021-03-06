const uuid = require("uuid").v4;
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");
const httpEventNormalizer = require("@middy/http-event-normalizer");
const httpErrorHandler = require("@middy/http-error-handler");
const createError = require("http-errors");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createAuction = async function (event, context) {
  const { title } = event.body;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: "open",
    createdAt: now.toISOString(),
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

exports.handler = middy(createAuction)
  .use(httpJSONBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
