const { PubSub } = require('@google-cloud/pubsub');
const fs = require('fs');
const path = require('path');

// Load the service account key from the file
const getServiceAccountKey = () => {
    const keyFilePath = path.resolve(__dirname, 'service-account.json');
    const keyFile = fs.readFileSync(keyFilePath, 'utf8');
    console.log('Service account key file loaded.');
    return JSON.parse(keyFile);
};

// Lambda handler
exports.handler = async (event) => {
    try {
        console.log('Lambda function triggered.');
        const secrets = getServiceAccountKey();
        const credentials = {
            client_email: secrets.client_email,
            private_key: secrets.private_key,
        };

        console.log('Google Cloud credentials created.');
        const message=event;

        const pubsub = new PubSub({ projectId: 'serverless-426402', credentials });
        const topicName = 'customer-concern';
        const data = JSON.stringify({ message:event});
        const dataBuffer = Buffer.from(data);

        console.log(`Publishing message to topic: ${topicName}`);
        const messageId = await pubsub.topic(topicName).publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
};
