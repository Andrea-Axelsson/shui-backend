import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export async function handler(event, context) {

    try {
    const { id } = event.pathParameters;
    const { message } = JSON.parse(event.body); // Anta att body innehåller det uppdaterade todo-objektet

    if(!message){
        return sendError(400, {success: false, message: 'You must write a message'})
    }
    
        const result = await db.update({
            TableName: 'messages-db',
            Key: {
                id: id
            },
            UpdateExpression: 'set message = :m',
            ExpressionAttributeValues: {
                ':m': message
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();

        console.log('Update operation successful:', result);
        return sendResponse(200, { success: true, message: 'Message successfully updated', data: result.Attributes });
    } catch (error) {
        console.error('Error:', error);
        return sendError(500, { success: false, message: 'Could not update Message' });
    }
}