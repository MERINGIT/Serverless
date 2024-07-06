import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import {SECRETS} from './service-account.js';
  
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Bookings';

export const handler = async (event) => {
    let message = "";
    let booking = true;

    // Determine which intent is being fulfilled
    const intentName = event.sessionState.intent.name;
    console.log(intentName);
    
    if (intentName === "RegistrationAssistance") {
        message = "To register, please visit the registration page and fill out the required information.";
    } else if (intentName === "Login") {
        message = "To log in, please go to the login page and enter your credentials.";
    } else if (intentName === "BookingDetails") {
        booking = true;
        const bookingReference = event.sessionState.intent.slots.bookingReference.value.originalValue;
        console.log(bookingReference);
        message = await getBookingDetails(bookingReference, booking);
    } else if (intentName === "RaiseConcern") {
        booking = false;
        console.log("Inside Raise Concern")
        console.log(event.sessionState.intent.slots.myConcern.value)
        const concern = event.sessionState.intent.slots.myConcern.value.originalValue;
        console.log(concern);
        const bookingReference = event.sessionState.intent.slots.bookingReference.value.originalValue;
        console.log(bookingReference);
        
        const userId = await getBookingDetails(bookingReference, booking);
        
        // Publish message to Pub/Sub   
        try {
            const messageData = Buffer.from(JSON.stringify({ message: { concern, bookingReference, userId: userId.toString() }})).toString('base64');
            const messageId = await publishToPubSub('projects/serverless-426402/topics/customer-concern', messageData);
            console.log(`Message ${messageId} published.`);
            message = `Your concern has been raised successfully. Reference ID: ${messageId}`;
        } catch (error) {
            console.log(`Error publishing message: ${error}`);
            message = "There was an error raising your concern. Please try again later.";
        }
    } else {
        message = "I'm not sure how to help with that.";
    }

    // Create the response object
    const response = {
        sessionState: {
            sessionAttributes: event.sessionState.sessionAttributes || {},
            dialogAction: {
                type: "Close"
            },
            intent: {
                name: intentName,
                state: "Fulfilled"
            }
        },
        messages: [
            {
                contentType: "PlainText",
                content: message
            }
        ]
    };

    return response;
};

// Function to retrieve booking details from DynamoDB
const getBookingDetails = async (bookingReference, booking) => {
    let data;
    const params = {
        TableName: tableName,
        Key: {
            bookingReference: bookingReference
        }
    };

    try {
        const data = await dynamodb.get(params).promise();
        console.log(data);

        if (!data.Item) {
            return "No booking found with the provided reference code.";
        }

        const { roomNumber, startDate, endDate, userId } = data.Item;
        if(!booking){
            return userId;
        }
        return `Booking details: Room Number ${roomNumber}, Stay from ${startDate} to ${endDate}.`;
    } catch (error) {
        console.error(`Error retrieving booking details: ${error}`);
        return "Error retrieving booking details.";
    }
};

// Function to publish a message to Google Cloud Pub/Sub
const publishToPubSub = async (topicName, message) => {
    // const secrets = getServiceAccountKey();
    const accessToken = await getAccessToken();

    const url = `https://pubsub.googleapis.com/v1/${topicName}:publish`;
    const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    const data = {
        messages: [
            {
                data: message
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const responseBody = await response.json();
        return responseBody.messageIds[0];
    } else {
        throw new Error(`Error publishing message: ${await response.text()}`);
    }
};

// Function to get access token for Google Cloud Pub/Sub
const getAccessToken = async () => {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const payload = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: generateJWT()
    };

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload)
    });

    if (response.ok) {
        const responseBody = await response.json();
        return responseBody.access_token;
    } else {
        throw new Error(`Error obtaining access token: ${await response.text()}`);
    }
};

// Function to generate a JWT for Google Cloud Pub/Sub
const generateJWT = () => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: SECRETS.client_email,
        scope: "https://www.googleapis.com/auth/pubsub",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600
    };

    const privateKey = SECRETS.private_key;
    return jwt.sign(payload, privateKey, { algorithm: "RS256" });
};