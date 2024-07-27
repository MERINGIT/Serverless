const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  const { roomid, userId, userEmail, startDate, endDate } = event;

  // Generate a booking reference
  const bookingReference = Math.random().toString(36).substr(2, 9);

  try {
    // Fetch room details from the Rooms table
    const getRoomParams = {
      TableName: 'Rooms',
      Key: { roomid }
    };

    const roomData = await dynamoDB.get(getRoomParams).promise();

    if (!roomData.Item) {
      return { statusCode: 400, body: JSON.stringify('Room not found')
        , headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow all origins; adjust as needed
          'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
          'Access-Control-Allow-Headers': 'Content-Type'
      }
       };
    }

    const { roomNumber, roomType, imageurl} = roomData.Item;

    // Create a new booking entry in DynamoDB
    const putParams = {
      TableName: 'Bookings',
      Item: {
        bookingReference,
        userId,
        roomId:roomid,
        userEmail,
        roomNumber:roomData.Item.roomnumber,
        roomType:roomData.Item.roomtype,
        imageurl:roomData.Item.imageurl,
        startDate,
        endDate,
        bookingStatus: 'pending', // Initial status
      }
    };

    await dynamoDB.put(putParams).promise();
    console.log('Booking created successfully');

    // Subscribe the user to the SNS topic
    const subscriptionParams = {
      Protocol: 'email',
      TopicArn: 'arn:aws:sns:us-east-1:339712706194:BookingNotifications',
      Endpoint: userEmail
    };

    await sns.subscribe(subscriptionParams).promise();
    console.log('User subscribed to SNS topic');

    // Send a message to SQS with the booking details
    const sqsParams = {
      MessageBody: JSON.stringify({
        bookingReference,
        userId,
        roomid,
        userEmail,
        roomNumber,
        roomType,
        startDate,
        endDate,
        nextavailabledate: roomData.Item.nextavailabledate,
      }),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/339712706194/BookingRequestsQueue',
      DelaySeconds: 20 // 5 minutes delay
    };

    await sqs.sendMessage(sqsParams).promise();
    console.log('Message sent to SQS');

    return { statusCode: 200, body: JSON.stringify('Booking created and request sent for processing'),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins; adjust as needed
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type'
     }
    };
  } catch (error) {
    console.error('Error creating booking or sending request:', error);
    return { statusCode: 500, body: JSON.stringify('Error creating booking or sending request'),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins; adjust as needed
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
     };
  }
};
