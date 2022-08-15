import { KMS, S3 } from "aws-sdk";

const BUCKET = "import-bucket-task-5";
const AWS = require("aws-sdk");
const s3: S3 = new AWS.S3({ region: "eu-central-1" });
const csv = require("csv-parser");

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
    const results = await readFileAsync(catalog.Key);
    console.log(results);
    moveParsedObject(catalog.Key, JSON.stringify(results));
  }
};

const moveParsedObject = async (key: string, content: string) => {
  await s3
    .putObject({
      Bucket: BUCKET,
      Key: key.replace("uploaded", "parsed").replace("csv", "json"),
      Body: content,
      ContentType: "text/json",
    })
    .promise();

  await s3
    .deleteObject({
      Bucket: BUCKET,
      Key: key,
    })
    .promise();
};

const readFileAsync = (
  catalogKey: string
): Promise<Record<string, unknown>> => {
  const params = {
    Bucket: BUCKET,
    Key: catalogKey,
  };
  const results: Record<string, unknown>[] = [];
  return new Promise((resolve, reject) => {
    s3.getObject(params)
      .createReadStream()
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => reject(error));
  });
};
