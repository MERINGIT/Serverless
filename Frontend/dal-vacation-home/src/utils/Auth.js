import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { SRPClient } from 'amazon-user-pool-srp-client';
import AWS from 'aws-sdk';

const poolData = {
  UserPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AUTH_APP_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
});

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const userPoolId = process.env.REACT_APP_AUTH_USER_POOL_ID.split('_')[1]
const srp = new SRPClient(userPoolId)
const SRP_A = srp.calculateA()

export const signIn = (username, password) => {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: username,
      Password: password,
      AuthFlow: 'CUSTOM_AUTH',
      AuthParameters: {
        CHALLENGE_NAME: SRP_A,
        SRP_A: SRP_A
      }
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.initiateAuth(authenticationDetails, {
      onSuccess: (session) => {
        resolve({ cognitoUser, session });
      },
      onFailure: (err) => {
        reject(err);
      },
      customChallenge: (challengeParameters) => {
        switch (challengeParameters.challengeName) {
          case 'CUSTOM_CHALLENGE':
            console.log("Here");
            // Handle QUESTION challenge
            // Example: Prompt user to answer security question
            resolve({ cognitoUser, challengeParameters });
            break;
          case 'CAESAR_CIPHER':
            // Handle CAESAR_CIPHER challenge
            // Example: Prompt user to solve a cipher
            resolve({ cognitoUser, challengeParameters });
            break;
          default:
            reject(new Error('Unsupported challenge'));
        }
      },
    });
  });
};

export const respondToCustomChallenge = (cognitoUser, challengeResponses) => {
  return new Promise((resolve, reject) => {
    cognitoUser.sendCustomChallengeAnswer(challengeResponses, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

// Example function to verify if the challenge response is valid
export const verifyChallengeResponse = async (challengeName, challengeResponse) => {
  // Implement logic to verify the challenge response using VerifyAuthChallengeResponse Lambda function
  // Return true or false based on verification result
  return true; // Replace with actual verification logic
};
