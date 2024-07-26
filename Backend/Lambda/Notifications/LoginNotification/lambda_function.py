import json
import boto3

sns_client = boto3.client('sns')

def lambda_handler(event, context):
    topic_arn = 'arn:aws:sns:us-east-1:318259315068:User_Notifications'
    
     # Parse the incoming request body
    # body = json.loads(event['body'])
    # email = body.get('email')
    email = event['email']

    # Define the subject and message for the login notification
    subject = 'Login Notification'
    message = f'User {email} has successfully logged in.'

    # Publish the message to SNS
    response = sns_client.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject=subject
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Notification sent!')
    }

