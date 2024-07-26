const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    // Log the received event
    console.log('Received event:', JSON.stringify(event, null, 2));
    const  val=JSON.parse(event.body);
    // Extract userid from the event
    const userid = val.userid;
    console.log('User ID:', userid);

    // Define the CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Prepare the DynamoDB scan parameters
    const params = {
        TableName: 'Enquiries',
        FilterExpression: 'agentid = :agentid',
        ExpressionAttributeValues: {
            ':agentid': userid
        }
    };

    try {
        // Log the scan operation parameters
        console.log('Scanning DynamoDB with params:', JSON.stringify(params, null, 2));

        // Perform the scan operation on DynamoDB
        const data = await dynamodb.scan(params).promise();

        // Log the scan result
        console.log('Scan result:', JSON.stringify(data, null, 2));

        // Prepare the response with CORS headers and data items
        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(data.Items)
        };

        // Return the response
        callback(null, response);
    } catch (err) {
        // Log any errors that occur during the scan operation
        console.error('Error:', err);
        
        // Prepare the error response with CORS headers
        const errorResponse = {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };

        // Return the error response
        callback(null, errorResponse);
    }
};
