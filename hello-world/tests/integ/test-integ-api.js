const assert = require("chai").assert;
const AWS = require("aws-sdk");
const axios = require("axios");

const cloudformation = new AWS.CloudFormation();

// Stack name provided through environment variable.
const STACK_NAME = process.env["STACK_NAME"];
// Value declared in Outputs of template.yaml
const ENDPOINT_KEY = "HelloWorldApi";

describe("GET api test", async () => {
  let apiResponse;

  // Fetch API Endpoint from Cloudformation output.
  before(async () => {
    const response = await cloudformation
      .describeStacks({
        StackName: STACK_NAME,
      })
      .promise();
    const endpointOutput = response.Stacks[0].Outputs.find((x) => x.OutputKey === ENDPOINT_KEY);
    const apiEndpoint = endpointOutput.OutputValue;
    apiResponse = await axios.get(apiEndpoint);
  });

  it("verifies if response code is 200", async () => {
    assert.equal(apiResponse.status, 200);
  });

  it("verifies if response contains my username", async () => {
    // Replace "Hello world" with your username
    assert.include(apiResponse.data.message, "Hello world");
  });
});
