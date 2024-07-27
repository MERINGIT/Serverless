const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const { userEmail, notificationType } = JSON.parse(record.body);

    const notificationParams = {
      Message: `Your ${notificationType} was successful!`,
      Subject: `Successful ${notificationType}`,
      TopicArn: 'arn:aws:sns:us-east-1:339712706194:UserNotifications'
    };

    try {
      await sns.publish(notificationParams).promise();
      console.log(`Notification sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  return { statusCode: 200, body: JSON.stringify('Notifications processed successfully') };
};
