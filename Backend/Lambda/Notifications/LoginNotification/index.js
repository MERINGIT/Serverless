const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    // Parse the event to extract userEmail and notificationType
    let userEmail, notificationType;

    try {
        // Assume event.body contains the payload if triggered by API Gateway
    
        userEmail = event.userEmail;
        notificationType = event.notificationType;
    } catch (error) {
        console.error('Error parsing event:', error);
        return {
            statusCode: 400,
            body: JSON.stringify('Invalid request format'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins; adjust as needed
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }

    // Validate the email format (simple validation)
    if (!userEmail || !userEmail.includes('@')) {
        return {
            statusCode: 400,
            body: JSON.stringify('Invalid email address'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }

    const notificationParams = {
        Message: `Your ${notificationType} was successful!`,
        Subject: `Successful ${notificationType}`,
        TopicArn: 'arn:aws:sns:us-east-1:339712706194:UserNotifications'
    };

    try {
        // Publish the notification to the SNS topic
        await sns.publish(notificationParams).promise();
        console.log(`Notification sent to ${userEmail}`);
        return {
            statusCode: 200,
            body: JSON.stringify('Notification sent successfully'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    } catch (error) {
        console.error('Error sending notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error sending notification'),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }
};
