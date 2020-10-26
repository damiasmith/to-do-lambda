const parameter = require('./parameter');
const AWS = require('aws-sdk');

const getParameter = async (paramName) => {
    const SSM = new AWS.SSM();
    try {
        const parameterValue = await SSM.getParameter({Name: paramName}).promise();
        return parameterValue.Parameter.Value;
    } catch (err) {
        console.log('getParameter', err);
        throw new Error(err);
    }
}

module.exports = { getParameter };