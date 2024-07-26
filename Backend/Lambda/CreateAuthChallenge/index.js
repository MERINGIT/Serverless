const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Users";

exports.handler = async (event) => {
    const challengeName = event.request.challengeName;
    const username = event.request.userAttributes.sub;
    const stage = event.request.session.length;
    
    if (challengeName === 'CUSTOM_CHALLENGE') {
        if (stage === 0) {
            const getParams = {
                TableName: tableName,
                Key: {
                    "userId":  username
                }
            };

            let question;

            try {
                console.log(getParams);
                const result = await dynamo.send(new GetCommand(getParams));
                console.log(result);
                question = result.Item.securityQuestion;
                answer = result.Item.securityAnswer;
            } catch (error) {
                console.error("Error retrieving security question:", error);
                throw error;
            }

            event.response.publicChallengeParameters = { question };
            event.response.publicChallengeParameters.type = "QUESTION_AUTH";
            event.response.privateChallengeParameters = { answer };
        } else if (stage === 1) {
            const getParams = {
                TableName: tableName,
                Key: {
                    "userId":  username
                }
            };

            let plaintext, ciphertext;

            try {
                console.log(getParams);
                const result = await dynamo.send(new GetCommand(getParams));
                console.log(result);
                plaintext = result.Item.caesarCipher;
                ciphertext = caesarCipher(plaintext);
            } catch (error) {
                console.error("Error retrieving cipher plaintext:", error);
                throw error;
            }

            event.response.publicChallengeParameters = { ciphertext };
            event.response.publicChallengeParameters.type = "CAESAR_CIPHER_AUTH";
            event.response.privateChallengeParameters = { plaintext };
        }
    }

    return event;
};

function caesarCipher(str) {
    const shift = Math.floor(Math.random() * 26);
    const cipher = str.replace(/[a-z]/g, (char) => 
        String.fromCharCode((char.charCodeAt(0) - 97 + shift) % 26 + 97)
    );
    return cipher;
}

