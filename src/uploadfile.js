"use strict"

const AWS = require("aws-sdk")
const s3 = new AWS.S3();
const bucketName = process.env.FILE_UPLOAD_BUCKET_NAME

module.exports.handler = async e => {
    console.log(e)

    // response object
    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({message: "Successfully file uploaded !!!"})
    }

    try{
        const parseBody = JSON.parse(e.body)
        const base64File = parseBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/,''),'base64');
        const params = {
            Bucket: bucketName,
            key: `images/${new Date().toISOString()}.png`,
            Body: decodedFile,
            contentType: "image/png"
        };
        const uploadResult  = await s3.upload(params).promise();
        response.body = JSON.stringify({message: "Successfully file uploaded !!!", uploadResult})
    }catch(e){
        console.log(e)
        response.body = JSON.stringify({message: "error !!!", e})
        response.statusCode = 500
    }
}

