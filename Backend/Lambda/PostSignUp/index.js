const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "Users";

exports.handler = async (event, context, callback) => {
  const { userAttributes } = event.request;

  const userId = userAttributes['sub'];
  const email = userAttributes['email'];
  const name = userAttributes['name'];
  const profile = userAttributes['profile'];
  const securityQuestion = userAttributes['custom:security-question'];
  const securityAnswer = userAttributes['custom:security-answer'];
  const caesarCipherText = userAttributes['custom:caesar-cypher'];

  const params = {
    TableName: tableName,
    Item: {
      userId: userId,
      email: email,
      name: name,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      caesarCipherText: caesarCipherText
    }
  };

  try {
    await dynamo.send(new PutCommand(params));
    console.log('User attributes stored in DynamoDB:', params.Item);
    callback(null, event);
  } catch (err) {
    console.error('Error storing user attributes in DynamoDB:', err);
    callback(err);
  }
};