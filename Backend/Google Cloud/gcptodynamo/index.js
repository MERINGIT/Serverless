const AWS = require('aws-sdk');

// Configure AWS SDK with credentials
AWS.config.update({
  accessKeyId: 'ASIAYYRUU4EOO2UEVGGT',
  secretAccessKey: 'vig4CpskXYbpM952G0H3eR3eNkjdBPU6+nXZRtw6',
  sessionToken: 'IQoJb3JpZ2luX2VjEKz//////////wEaCXVzLXdlc3QtMiJIMEYCIQCjVuWfifgaL6KqUMLdfcvndlZSY18KkLASMn4t16XOAQIhANYp1SK1ZCX/RhstL68i/P5c2TLYwIciDX8TpBTc4stMKqkCCGUQARoMNjAyNDc5NTgzNTE2Igy+MLGsyk1HiRt3be0qhgJzUX8YE2E7TcJ/FyZ4E8PnX255XiFY2NRVx4caYETYIraky5FOmhSXnTyORHLpgQUQIrzOkAN9ZPSkJ2ZlzJpQcj7W167KD8MImn+I8dwIBYfn8gZD7iQgK0MeCFBWgvw6vdhrL9oI2SWYN7iS5iKiheHdxBBG5Z/oR1b+AqCHcWrKR5czNR2Fb7a5QfwFbXGK26WzGe8vJ2qGkwQJ8ZLjMQRGg9oS2eAMCoFuni/j4yOM/pOcohQOk+WwgPZ61ECvcuCmQ/N6qARwK7ZhCdhEFYLK16+T7Sh2yyvX/ezE+PDF51nCl7O4tnVZvZveCu4czkEr9afJTVHAHaRx/GFGpTaRg9LaMMyPjLQGOpwBJ032kNNdjA6tleYGevN/NNQ9PCmWG3NErVZpgZ4Wtbp/8Yq+SUHeQmY2u698MZK+TeDZQBrUS4+Sd/WtZAySC7MogOha9VlcPEtrlNJQMSkHq0uYLNg8HZXttOglC8xoerNy9s2dtQNqoy7bFbY3ohLp/M7l+au80Oj1oWUCqemMtcwgk82cESh9NC/dPl25IQKirHLNidTk9H74',
  region: 'us-east-1' // Set the region where your DynamoDB is hosted
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.helloPubSub = async (event, context) => {
  const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString('utf-8'));

  const userId = eventData.message.userId; // Assuming userId is passed as a query parameter
  const bookingReference = eventData.message.bookingReference; // Assuming bookingReference is passed as a query parameter
  const concern = eventData.message.concern; // Assuming concern is passed as a query parameter
  console.log("Received userId:", userId);

  try {
    // Step 1: Fetch user details from the user table
    const userParams = {
      TableName: 'usertable',
      Key: {
        'userid': userId
      }
    };
    console.log("Fetching user details with params:", userParams);
    const userData = await dynamoDb.get(userParams).promise();
    const user = userData.Item;
    console.log("User data fetched:", userData);

    if (!user) {
      console.log("User not found for userId:", userId);
      return;
    }

    console.log("User found:", user);

    // Step 2: Fetch admin users using scan operation
    const scanParams = {
      TableName: 'usertable',
      FilterExpression: 'usertype = :usertype',
      ExpressionAttributeValues: {
        ':usertype': 'admin' // Example value to filter
      }
    };
    console.log("Fetching admin users with params:", scanParams);
    const scanResult = await dynamoDb.scan(scanParams).promise();
    const admins = scanResult.Items;
    console.log("Admin data fetched:", scanResult);

    if (admins.length === 0) {
      console.log("No admin users found");
      return;
    }

    console.log("Admin users found:", admins);

    // Step 3: Choose a random admin from the list
    // Step 3: Choose a random admin from the list
  let selectedAdmin;
  if (admins.length > 0) {
    const randomIndex = Math.floor(Math.random() * admins.length);
    selectedAdmin = admins[randomIndex];
  } else {
    console.log("No admin users found");
    // Handle the case where no admin is available (optional)
  }

    console.log(selectedAdmin);

    // Step 4: Store the enquiry details
    const enquiryParams = {
      TableName: 'enquiries',
      Item: {
        'enquiryid': new Date().getTime().toString(), // Unique ID for enquiry
        'userid': userId,
        'username': user.username,
        'useremail': user.useremail,
        'agentid': selectedAdmin.userid,
        'bookingReference': bookingReference,
        'concern': concern,
        'status': 'Open', // Initial status
        'comments': ""
      }
    };
    console.log("Storing enquiry with params:", enquiryParams.Item);
    await dynamoDb.put(enquiryParams).promise();

    console.log('Enquiry stored successfully');
  } catch (error) {
    console.error("Error processing enquiry:", error);
  }
};
