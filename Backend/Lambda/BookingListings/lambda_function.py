import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Bookings') 

def lambda_handler(event, context):

    userId = event['userId']

    try:
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('userId').eq(userId)
        )

        bookings = response['Items'] if 'Items' in response else []

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  # Enabled CORS setting 
            },
            'body': json.dumps(bookings, default=str) 
        }

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"An error occurred: {str(e)}")
        }
