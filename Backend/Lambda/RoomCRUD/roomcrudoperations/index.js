const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const parsedBody = JSON.parse(event.body);
    const httpMethod = parsedBody.httpMethod;
    const pathParameters = parsedBody.pathParameters;

    switch (httpMethod) {
        case 'POST':
            return await createRoom(parsedBody.body);
        case 'GET':
            if (pathParameters && pathParameters.roomId) {
                return await getRoomById(pathParameters.roomId);
            } else {
                return await listRooms();
            }
        case 'PUT':
            if (pathParameters && pathParameters.roomId) {
                return await updateRoom(pathParameters.roomId, parsedBody.body);
            }
            break;
        case 'DELETE':
            if (pathParameters && pathParameters.roomId) {
                return await deleteRoom(pathParameters.roomId);
            }
            break;
        default:
            console.log('Unsupported HTTP method:', httpMethod);
            return {
                statusCode: 400,
                headers: corsHeaders(),
                body: JSON.stringify({ message: 'Unsupported HTTP method' })
            };
    }
};

const createRoom = async (body) => {
    console.log('createRoom function called with body:', body);

    const item = {
        roomid: body.roomId,
        roomnumber: body.roomNumber,
        roomtype: body.roomType,
        hostedby: body.hostedBy,
        description: body.description,
        address: body.address,
        city: body.city,
        state: body.state,
        price: body.price,
        imageurl: body.imageUrl,
        isbooked: false,
        discountcode: body.discountCode,
        amenities: body.amenities,
        nextavailabledate: body.nextAvailableDate
    };
    console.log('Item to be stored:', item);

    try {
        await dynamodb.put({ TableName: 'Rooms', Item: item }).promise();
        console.log('Room created successfully');
        return {
            statusCode: 200,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Room created successfully' })
        };
    } catch (error) {
        console.error('Error creating room:', error);
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Error creating room', error: error.message })
        };
    }
};

const getRoomById = async (roomId) => {
    console.log('getRoomById function called with roomId:', roomId);

    try {
        const result = await dynamodb.get({ TableName: 'Rooms', Key: { roomid: roomId } }).promise();
        if (result.Item) {
            console.log('Room found:', result.Item);
            return {
                statusCode: 200,
                headers: corsHeaders(),
                body: JSON.stringify(result.Item)
            };
        } else {
            console.log('Room not found');
            return {
                statusCode: 404,
                headers: corsHeaders(),
                body: JSON.stringify({ message: 'Room not found' })
            };
        }
    } catch (error) {
        console.error('Error getting room:', error);
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Error getting room', error: error.message })
        };
    }
};

const listRooms = async () => {
    console.log('listRooms function called');

    try {
        const result = await dynamodb.scan({ TableName: 'Rooms' }).promise();
        console.log('Rooms found:', result.Items);
        return {
            statusCode: 200,
            headers: corsHeaders(),
            body: JSON.stringify(result.Items)
        };
    } catch (error) {
        console.error('Error listing rooms:', error);
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Error listing rooms', error: error.message })
        };
    }
};

const updateRoom = async (roomId, body) => {
    console.log('updateRoom function called with roomId:', roomId);
    console.log(body);

    // Remove roomid from body if it exists
    delete body.roomid;
    console.log(body);
    const updateExpression = 'set ' + Object.keys(body).map(key => `#${key} = :${key}`).join(', ');
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(body).forEach(key => {
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = body[key];
    });

    console.log('Update expression:', updateExpression);
    console.log('Expression attribute names:', expressionAttributeNames);
    console.log('Expression attribute values:', expressionAttributeValues);

    try {
        const result = await dynamodb.update({
            TableName: 'Rooms',
            Key: { roomid: roomId },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        }).promise();
        console.log('Room updated successfully:', result);
        return {
            statusCode: 200,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Room updated successfully', result })
        };
    } catch (error) {
        console.error('Error updating room:', error);
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Error updating room', error: error.message })
        };
    }
};

const deleteRoom = async (roomId) => {
    console.log('deleteRoom function called with roomId:', roomId);

    try {
        await dynamodb.delete({ TableName: 'Rooms', Key: { roomid: roomId } }).promise();
        console.log('Room deleted successfully');
        return {
            statusCode: 200,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Room deleted successfully' })
        };
    } catch (error) {
        console.error('Error deleting room:', error);
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ message: 'Error deleting room', error: error.message })
        };
    }
};

const corsHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
});
