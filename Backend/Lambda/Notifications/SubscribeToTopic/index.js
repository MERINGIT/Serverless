const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();

exports.handler = async (event) => {
    console.log(event);
    const { userEmail, notificationType } = event;

    const subscriptionParams = {
        Protocol: 'email',
        TopicArn: 'arn:aws:sns:us-east-1:339712706194:UserNotifications',
        Endpoint: userEmail
    };

    try {
        // Subscribe the user to the SNS topic
        const subscriptionData = await sns.subscribe(subscriptionParams).promise();
        console.log('Subscription ARN:', subscriptionData.SubscriptionArn);

        // Sending message to SQS with delay
        const sqsParams = {
            MessageBody: JSON.stringify({ userEmail, notificationType }),
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/339712706194/DelayedNotificationQueue', // Replace with your SQS Queue URL
            DelaySeconds: 100 // 100 seconds delay
        };

        await sqs.sendMessage(sqsParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify('Subscription request sent successfully. Please confirm your subscription via the email you received.'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins; adjust as needed
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    } catch (error) {
        console.error('Error during subscription:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error during subscription'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }
};
