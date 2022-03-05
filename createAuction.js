const  uuid = require("uuid").v4;
const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async function (event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: "open",
    createdAt: now.toISOString(),
  };

  await dynamoDB.put({
    TableName: "AuctionsTable",
    Item: auction,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};
