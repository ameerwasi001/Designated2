const AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';
const lambda = new AWS.Lambda();

const invoke = async (funcName, payload) => {
    var params = {
        FunctionName: funcName,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(payload)
    };

    const res = await lambda.invoke(params).promise()
    return res
}

const lambdaQuery = async (queries, user) => {
    const data = await invoke("graphql-dev-app", {
        "body": JSON.stringify({
            queries: queries,
            user: user,
        })
    })
    const payload = JSON.parse(data.Payload)
    console.log(payload)
    if(payload.errorType) throw {
        status: 500,
        success: true,
        message: payload.errorMessage,
        data: {}
    }
    return JSON.parse(payload.body)
}

module.exports = lambdaQuery