import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductById from "@functions/getProductById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NOTIFICATION_TOPIC_ARN: {
        Ref: "catalogNotificationTopic",
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: {
              Ref: "catalogNotificationTopic",
            },
          },
        ],
      },
    },
    lambdaHashingVersion: "20201221",
    region: "eu-central-1",
    stage: "dev",
    httpApi: {
      cors: true,
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess,
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      catalogNotificationTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "catalogNotificationTopic",
        },
      },
      catalogNotificationSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "maaaaksiiiim@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "catalogNotificationTopic",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
