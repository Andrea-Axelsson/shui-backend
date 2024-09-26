import { sendResponse, sendError }from '../../responses/index.js'
import { db }from '../../services/db.js'


let nanoid;
import('nanoid').then(module => {
    nanoid = module.nanoid;
}).catch(err => {
    console.error('Failed to load nanoid:', err);
});

export async function handler(event, context) {

    try {

    const { username, message } = JSON.parse(event.body);

    if(!username || !message){
        return sendError(400, {success: false, message: 'Username and message cannot be empty'})
    }
    
        // Vänta på att nanoid blir tillgängligt
        if (!nanoid) {
            await import('nanoid').then(module => {
                nanoid = module.nanoid;
            });
        }

        const id = nanoid();
        const createdAt = new Date();  // Skapa ett korrekt Date-objekt här

        // Formatera createdAt till 'yyyy-mm-dd, HH:MM'
        const formattedCreatedAt = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}, ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`;


        const post = {
            id: id,
            username: username,
            message: message,
            createdAt: formattedCreatedAt
        };

        await db.put({
            TableName: 'messages-db',
            Item: post
        }).promise();

        return sendResponse(200, { success: true, post: post });
    } catch (error) {
        console.error('Error:', error);
        return sendError(500, { success: false, message: 'Could not add message' });
    }
}