const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const body=JSON.parse(event.body);
  const { userId, bookingReference, concern }=body.data;
  


  try {
    // Step 1: Fetch user details from DynamoDB
    const userParams = {
      TableName: 'Users', // Replace with your DynamoDB table name for users
      Key: {
        'userId': userId
      }
    };

    console.log("Fetching user details with params:", userParams);
    const userData = await dynamoDb.get(userParams).promise();
    const user = userData.Item;

    if (!user) {
      console.log("User not found for userId:", userId);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }

    console.log("User data fetched:", userData);

    // Step 2: Fetch admin users using DynamoDB scan operation (example)
    const scanParams = {
      TableName: 'Users', // Replace with your DynamoDB table name for users
      FilterExpression: 'profile = :profile',
      ExpressionAttributeValues: {
        ':profile': 'agent'
      }
    };

    console.log("Fetching admin users with params:", scanParams);
    const scanResult = await dynamoDb.scan(scanParams).promise();
    const admins = scanResult.Items;

    if (admins.length === 0) {
      console.log("No admin users found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No admin users found' })
      };
    }

    console.log("Admin users found:", admins);

    // Step 3: Choose a random admin from the list (example)
    let selectedAdmin;
    if (admins.length > 0) {
      const randomIndex = Math.floor(Math.random() * admins.length);
      selectedAdmin = admins[randomIndex];
    } else {
      console.log("No admin users found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No admin users found' })
      };
    }

    console.log("Selected admin:", selectedAdmin);

    // Step 4: Store the enquiry details in DynamoDB
    const enquiryParams = {
      TableName: 'Enquiries', // Replace with your DynamoDB table name for enquiries
      Item: {
        'enquiryid': new Date().getTime().toString(), // Unique ID for enquiry
        'userid': userId,
        'username': user.name,
        'useremail': user.email,
        'agentid': selectedAdmin.userId,
        'bookingReference': bookingReference,
        'concern': concern,
        'status': 'Open', // Initial status
        'comments': '' // Optional, empty for initial
      }
    };

    console.log("Storing enquiry with params:", enquiryParams.Item);
    await dynamoDb.put(enquiryParams).promise();

    console.log('Enquiry stored successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Enquiry stored successfully' })
    };
  } catch (error) {
    console.error('Error storing enquiry:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error storing enquiry' })
    };
  }
};
