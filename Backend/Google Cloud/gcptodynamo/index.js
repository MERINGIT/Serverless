const AWS = require('aws-sdk');

// Configure AWS SDK with credentials
AWS.config.update({
  accessKeyId: 'ASIAYYRUU4EOOMMW2MN4',
  secretAccessKey: 'UJNzIwJXIWcVl2CyaHy/idHJoR0iHbFOev4GbT3B',
  sessionToken: 'IQoJb3JpZ2luX2VjEJD//////////wEaCXVzLXdlc3QtMiJIMEYCIQDlZtbi9LyjSuMa3X6hFvekAKc6/Ponc0aIk++SdRT3BgIhAMjSK6EPNK+Uxgv5D4IyMNH//RVin7+H5meUWbqDzC/ZKqkCCDkQARoMNjAyNDc5NTgzNTE2Igzxn+8FkqEPF5dPor8qhgIfnFJqfu+iQhLYuBYeu7vGmslwwgWmnlKf5XiRVQlJaTLm1gdSDPSwYlcJTwd8CaduhOETLYm2uKVmlDendG8lFJMTwtTqyXHLLnDrbdVT5gwgo3uqsZMH2d1GMkP0VTDxaxddRaU3Ho3CNEmXDvrqfshT9mDFHrf8+g5j8mA2cj8v+KiiC23hzZxyR0cm5Da87AoRww1YGdF3MX/IpWRtGm1kXRElCEbcEt2KCvs/3FmpNwgFVBCjqYQ+qQHpVKqhC9uz1gb3JV+T6Jovw40Tu8i0N6Y3KQ1fBySO4Yk1NA+o3jw7ZGjyVKh8kvY5IuvbPkMbdA+3rypCgP9uVb+heRtVQQfoMLXozbMGOpwBufl/8OzxGyYMl+B70V0jMB5JDR7XN0R8kduQ8tbaGDC+ESEYGlDfxxiE9GnZtYZHPjn05074V74Y8LNqKv5USTi3gJoLJazIRZtsX/aQwZfCMlpPuyTWstvP65hf2bs9Nb88wLvxnzo2bSevqUF1IlUa4049LANMCbYsNAaVdktuKy73k6EfuqFr2dYngkhjk3Djb/Hc//B98XY7',
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

    // Step 3: Choose one admin (for simplicity, choosing the first admin)
    const selectedAdmin = admins[0];

    // Step 4: Store the enquiry details
    const enquiryParams = {
      TableName: 'enquiries',
      Item: {
        'enquiryid': new Date().getTime().toString(), // Unique ID for enquiry
        'userid': userId,
        'username': user.username,
        'useremail': user.email,
        'agentid': selectedAdmin.userid,
        'bookingReference': bookingReference,
        'concern': concern,
        'status': 'new', // Initial status
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
