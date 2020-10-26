const parameter = require('./parameter');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();
const {'v4': uuidv4} = require('uuid')

const handler = async (event) => {
    if (event.httpMethod !=='POST') {
        throw new Error(`putLists only accepts POST methods, you tried ${event.httpMethod}`);
    }
    console.log('event: ' + JSON.stringify(event));

    const tableName = await parameter.getParameter('/to_do/table_name');

    const body = JSON.parse(event.body);
    const listId = uuidv4;
    const cardId = body.card_id;
    const cardTitle = body.title;

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
            description: body.description,
            complete: body.completed
        }
    )
    console.log(lists);

    const params = {
        TableName: tableName,
        Item: {
            id: cardId,
            Title: title
        }
    }

    try {
        const result = await docClient.put(params).promise();

        let response = {
            statusCode: 200,
            body: JSON.stringify(cards)
        }
        return response;
    } catch (err) {
        console.log('putList', err);
        throw new Error(err);
    }
}
module.exports = { handler };