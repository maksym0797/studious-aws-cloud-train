import { S3 } from "aws-sdk";

const BUCKET = "import-bucket-task-5";
const AWS = require("aws-sdk");
const s3: S3 = new AWS.S3({ region: "eu-central-1" });

export const getSignedUrlByName = async (name: string): Promise<string> => {
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: "text/csv",
  };
  return new Promise((resolve, reject) => {
    s3.getSignedUrl("putObject", params, (error, url) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(url);
    });
  });
};

export const uploadToS3 = async () => {
  const params = {
    Bucket: BUCKET,
    Prefix: "uploaded/",
    Delimiter: "/",
  };
  const catalogs = await s3.listObjectsV2(params).promise();
  for (const catalog of catalogs.Contents) {
    const params = {
      Bucket: BUCKET,
      Key: catalog,
    };
    const s3Stream = s3.getObject(params).createReadStream();
  }
};
