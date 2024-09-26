import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export async function handler(event, context) {
    const { username } = event.queryStringParameters; // Läs in användarnamnet från query-parametern

    if (!username) {
        return sendError(400, { success: false, message: 'Username is required' });
    }

    try {
        const result = await db.query({
            TableName: 'messages-db',
            IndexName: 'username-index',  // Använd det sekundära indexet
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username': username
            }
        }).promise();

        console.log('Query for username operation successful:', result);
        return sendResponse(200, { success: true, messages: result.Items });
    } catch (error) {
        console.error('Error:', error);
        return sendError(500, { success: false, message: 'Could not fetch messages for user' });
    }
}