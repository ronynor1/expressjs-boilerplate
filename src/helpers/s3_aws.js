const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const params = {
    Bucket : 'bucketname', /* Another bucket working fine */ 
    CopySource : 'bucketname/externall/1.txt', /* required */
    Key : "1.txt", /* required */
    ACL : 'public-read',
};

// move file from temp_bucket to s3_bucket
exports.moveFile = () => {
    s3.copyObject(params, function(err, data) {
        if (err)
            console.log(err, err); // an error occurred
        else {
            console.log(data); // successful response
        }
    });
}

// maybe pass object from controller to moveFile function (params)