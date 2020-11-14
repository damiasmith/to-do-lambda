const parameter = require('./parameter');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();

const handler = async (event) => {
    // if (event.httpMethod !=='POST') {
    //     throw new Error(`putLists only accepts POST methods, you tried ${event.httpMethod}`);
    // }
    console.log('event: ' + JSON.stringify(event));

    const tableName = await parameter.getParameter('/to_do/table_name');

    const listId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const cardId = event.card_id;
    const cardTitle = event.title;

    const paramsId = {
        TableName: tableName,
        Key: {id: cardId}
    }
    const data = await docClient.get(paramsId).promise();
    console.log('data: ', data);

    let lists = [];

    if (data.Item.lists) lists = data.Item.lists;

    lists.push(
        {
            list_id: listId,
            description: event.description,
            completed: event.completed
        }
    )
    console.log(lists);

    const params = {
        TableName: tableName,
        Item: {
            id: cardId,
            Title: cardTitle,
            lists: lists
        }
    }

    try {
        const result = await docClient.put(params).promise();

        let response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(event)
        }
        return response;
    } catch (err) {
        console.log('putList', err);
        throw new Error('list not added', err);
    }
}
module.exports = { handler };