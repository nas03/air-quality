# Server Development Tasks

## Week 1 (Jan 1-5, 2025)

Core API & Data Management:

- [x] Set up API authentication system
- [x] Implement Redis caching for improved performance
- [x] Create endpoint to fetch 7-day historical dataset
- [x] Build API for district/province AQI and PM2.5 averages

## Week 2 (Jan 6-12, 2025)

Data Processing & Collection:

- [x] Enhance Python script with AQI calculations
  - [x] Update database schema and data
- [x] Develop data crawler for Center of Environmental Monitoring (cem.gov.vn)

## Week 3 (Jan 13-19, 2025)

User Systems & Rankings:

- [x] Create API endpoints for AQI rankings by region
- [x] Implement user authentication system
- [x] Build user registration and login functionality

## Week 4 (Jan 21-26, 2025)

Data Integration & Notifications:

- [ ] Integrate data from moitruongthudo.vn
- [ ] Add PM2.5 data collection from CEM
- [x] Set up automated email warning system for users

// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// <https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html>

import {
SecretsManagerClient,
GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "airq";

const client = new SecretsManagerClient({
region: "ap-southeast-1",
});

let response;

try {
response = await client.send(
new GetSecretValueCommand({
SecretId: secret_name,
VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
})
);
} catch (error) {
// For a list of exceptions thrown, see
// https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
throw error;
}

const secret = response.SecretString;

// Your code goes here
