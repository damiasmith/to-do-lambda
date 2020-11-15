const parameter = require('./parameter');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const getAllCards = require('./get-all-cards');
const docClient = new dynamoDb.DocumentClient();

const handler = async (event) => {
    // if (event.httpMethod !=='DETETE') {
    //     throw new Error(`deleteCard only accepts 'DETETE' methods, you tried ${event.httpMethod}`);
    // }
    console.log('event: ' + JSON.stringify(event));

    const tableName = await parameter.getParameter('/to_do/table_name');

    const id = event.id;
    const listId = event.list_id

    const params = {
        TableName: tableName,
        Key: { id }
    }

    try {
        const data = await docClient.get(params).promise();
        console.log(data);
        let card = data.Item;
        let lists = card.lists;

        const index = lists.findIndex(list => list.list_id === listId);
        const newLists = [...lists.slice(0, index), ...lists.slice(index + 1)];
        card.lists = newLists;
            
        const deleteParams = {
            TableName: tableName,
            Key: { id },
            Item: card
        }

        const result = await docClient.put(deleteParams).promise();

        let response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({'id': card.id, 'Title': card.Title, 'lists': card.lists})
        }
        return response;
    } catch (err) {
        console.log('delete list', err);
        throw new Error('list not deleted', err);
    }
}
module.exports = { handler };