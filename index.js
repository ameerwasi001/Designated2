const { query } = require("./txQuery")

const _1 = require("./server")
const _2 = require("./app")
const _3 = require("./Utils/matchers")
const _4 = require("./Utils/postprocessors")

module.exports.handler = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false
    console.log(event)
    const body = JSON.parse(event.body)

    const results = []
    for(const q of body.queries) results.push(query(q, body.user))
    Promise.all(results)
      .then(res => {
        const response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(res),
        }
        callback(null, response)
      })
};