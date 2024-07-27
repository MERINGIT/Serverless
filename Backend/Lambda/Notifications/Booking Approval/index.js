const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const { bookingReference, userId, roomid, userEmail, roomNumber, roomType, startDate, endDate, nextavailabledate } = JSON.parse(record.body);

    try {
      // Fetch the current booking details
      const getBookingParams = {
        TableName: 'Bookings',
        Key: { bookingReference }
      };

      const booking = await dynamoDB.get(getBookingParams).promise();

      if (!booking.Item) {
        console.error('Booking not found');
        continue;
      }

      // Fetch room details from the Rooms table
      const getRoomParams = {
        TableName: 'Rooms',
        Key: { roomid }
      };

      const roomData = await dynamoDB.get(getRoomParams).promise();

      if (!roomData.Item) {
        console.error('Room not found');
        continue;
      }

      let bookingStatus = 'approved';
      let message = `Your booking with reference ${bookingReference} has been approved`;

      // Check if the start date is greater than the next available date and the room is not already booked
      if (new Date(startDate) <= new Date(nextavailabledate) && roomData.Item.isbooked) {
        bookingStatus = 'rejected';
        message = `Your booking with reference ${bookingReference} has been rejected due to invalid dates or room already booked`;
        console.error(message);
      }

      // Update the booking status in DynamoDB
      const updateBookingParams = {
        TableName: 'Bookings',
        Key: { bookingReference },
        UpdateExpression: 'set bookingStatus = :status',
        ExpressionAttributeValues: {
          ':status': bookingStatus
        }
      };

      await dynamoDB.update(updateBookingParams).promise();
      console.log(`Booking status updated in DynamoDB: ${bookingStatus}`);

      // Only update the next available date and booked status in the Rooms table if the booking is approved
      if (bookingStatus === 'approved') {
        const updateRoomParams = {
          TableName: 'Rooms',
          Key: { roomid },
          UpdateExpression: 'set nextavailabledate = :nextavailabledate, isbooked = :isbooked',
          ExpressionAttributeValues: {
            ':nextavailabledate': new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            ':isbooked': true
          }
        };

        await dynamoDB.update(updateRoomParams).promise();
        console.log('Room availability updated in DynamoDB');
      }

      // Notify the user about the booking status
      const notificationParams = {
        Message: message,
        Subject: bookingStatus === 'approved' ? 'Booking Approved' : 'Booking Rejected',
        TopicArn: 'arn:aws:sns:us-east-1:339712706194:BookingNotifications'
      };

      await sns.publish(notificationParams).promise();
      console.log('Notification sent to SNS');

    } catch (error) {
      console.error('Error processing booking approval/rejection:', error);
    }
  }

  return { statusCode: 200, body: JSON.stringify('Booking approval/rejection processed') };
};
