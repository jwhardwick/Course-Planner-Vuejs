// DB CITY
const AWS = require('aws-sdk')
AWS.config.update({
  region: "us-east-1"
});
var db = new AWS.DynamoDB.DocumentClient()


module.exports.getSubjectById = function(code, callback) {

    console.log(code)

        params = {
            TableName: 'Subjects',
            Key: { 'code' : code }
        }

        db.get(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error: ", JSON.stringify(err, null, 2))
            } else {
                console.log("GetItem succeeded: ", JSON.stringify(data, null, 2))
                return JSON.stringify(data, null, 2)

            }

        })


}
