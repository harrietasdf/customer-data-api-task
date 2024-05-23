Clone repo
use 18.18.2
from the root run npm i

# Open Customer Data Api Test Automation Suite

### About it

This is the test suite for the test automation of the /accounts API

## 💻 Requirments

Please ensure you've installed all the project dependancies before running the test suite

- Have Git installed
- Have Docker host installed and running
- Have Gradle installed
- Have java 17 Amazon Coretto installed
- Use Node 18.18.2

## 🚀 Running the tests

Setup:
From the root of the project run the following command to install all node dependencies

```bash
npm i
```

Running:
From the root of the project run the following command:

```bash
npm run test
```

## Setting up CI

The folowing env vars need secrets to be setup, then added as a step in CI to be pulled and used during the test:

- BASE_URL
- CONSENTS_URL
- ACCOUNTS_URL

## Test Suite structure

- CUSTOMER-DATA-API-TASK
  - tests
    - specs
      - test.spec.ts
    - utils
      - util.ts
  - tsconfig.json
  - README.md
  - prettierrc
- .env
- .prettierignore
- package-lock.json
- package.json
- playwright.config.ts
