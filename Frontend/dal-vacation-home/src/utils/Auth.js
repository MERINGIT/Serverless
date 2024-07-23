import { CognitoIdentityProviderClient, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
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

const userPoolId = process.env.REACT_APP_AUTH_USER_POOL_ID.split('_')[1];
const srp = new SRPClient(userPoolId);
const SRP_A = srp.calculateA();

export const signIn = (username, password) => {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: username,
      Password: password,
      AuthFlow: 'CUSTOM_AUTH',
      AuthFlowType: 'CUSTOM_AUTH',
      AuthParameters: {
        CHALLENGE_NAME: 'CUSTOM_CHALLENGE',
        SRP_A,
      },
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
        resolve({ cognitoUser, challengeParameters });
      },
    });
  });
};

export const getUserAttributes = (cognitoUser) => {
  return new Promise((resolve, reject) => {
    cognitoUser.getUserAttributes((err, attributes) => {
      if (err) {
        reject(err);
      } else {
        const result = {};
        attributes.forEach(attribute => {
          result[attribute.Name] = attribute.Value;
        });
        resolve(result);
      }
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

export const respondToAuthChallenge = async (username, session, challengeResponse) => {
  try {
    const params = {
      ClientId: process.env.REACT_APP_AUTH_APP_CLIENT_ID,
      ChallengeName: "CUSTOM_CHALLENGE",
      Session: session,
      UserPoolId: userPoolId,
      ChallengeResponses: {
        USERNAME: username,
        ANSWER: challengeResponse,
      },
    };

    console.log('Responding to auth challenge with params:', params);

    const client = new CognitoIdentityProviderClient({ region: process.env.REACT_APP_AWS_REGION });

    const command = new RespondToAuthChallengeCommand(params);
    const response = await client.send(command);

    console.log('Response from Cognito:', response);

    if (response.AuthenticationResult) {
      console.log(response);
      return {
        success: true,
        session: response.AuthenticationResult,
      };
    } else if (response.ChallengeName) {
      return {
        success: false,
        challengeName: response.ChallengeName,
        challengeParameters: response.ChallengeParameters,
      };
    } else {
      throw new Error('Unexpected response from RespondToAuthChallenge');
    }
  } catch (err) {
    console.error('Error responding to auth challenge:', JSON.stringify(err, null, 2));
    throw new Error(`Error responding to auth challenge: ${err.message}`);
  }
};

export const logoutUser = () => {
  let cognitoUser = userPool.getCurrentUser();
  return new Promise((resolve, reject) => {
    if (!cognitoUser) {
      console.error('No user is currently authenticated.');
      return reject('No user is currently authenticated.');
    }

    // Call Cognito's sign out method
    cognitoUser.signOut();
    resolve('Logged out successfully.');
  });
}

