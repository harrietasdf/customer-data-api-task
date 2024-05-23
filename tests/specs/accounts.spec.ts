import test, { expect } from "@playwright/test";
import { createConsent, createConsentAndUpdateStatus } from "../utils/auth";
import {
  GetAccounts200ResponseObject,
  GetAccountsErrorResponseObject,
} from "../utils/accountsResponseTypes";
import { getAccountsResponseValidatior } from "../utils/openApiSpec";
import { ACCOUNTS_URL, BASE_URL, callGetAccounts } from "../utils/utils";

test("User with valid Authentication sees an accounts list", async function ({}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");

  const accountsGetResponse = await callGetAccounts(consentId);

  const accountsGetResponseBody: GetAccounts200ResponseObject =
    await accountsGetResponse.json();

  const getAccountsResponseValidator = await getAccountsResponseValidatior();
  const validationErrors = getAccountsResponseValidator.validateResponse(
    200,
    accountsGetResponseBody,
  );
  if (typeof validationErrors !== undefined) {
    console.log("Response status code:", accountsGetResponse.status);
    console.log("Response body:", accountsGetResponseBody);
  }

  expect(accountsGetResponse.status).toEqual(200);
});

const testCasesAwaitingConsents = [
{ permission: "CREDIT_CARD_READ", expectedStatus: 403, expectedMessage: "Forbidden" },
{ permission: "ACCOUNTS_READ", expectedStatus: 403, expectedMessage: "Forbidden" },
]

testCasesAwaitingConsents.forEach(({ permission, expectedStatus, expectedMessage }) => {
  test(`User has ${permission} consent with status AWAITING_AUTHORISATION, receive a ${expectedStatus} forbidden error`,async function ({}) {
  const { consentId, consentPostResponseStatus } =
    await createConsent(permission);
  expect(consentPostResponseStatus).toEqual("AWAITING_AUTHORISATION");

  const accountsGetResponse = await callGetAccounts(consentId);

  const accountsGetResponseBody: GetAccountsErrorResponseObject =
    await accountsGetResponse.json();
  //I would use getAccountsResponseValidatior here if the openAPISpec had full error handling response body
  expect(accountsGetResponse.status).toEqual(expectedStatus);
  expect(accountsGetResponseBody.message).toEqual(expectedMessage);
});
})


const testCasesUpdatedConsents = [
  { permission: "CREDIT_CARD_READ", status: "AUTHORISED", expectedStatus: 403, expectedMessage: "Forbidden" },
  { permission: "CREDIT_CARD_READ", status: "REJECTED", expectedStatus: 403, expectedMessage: "Forbidden" },
  { permission: "ACCOUNTS_READ", status: "REJECTED", expectedStatus: 403, expectedMessage: "Forbidden" },
];

testCasesUpdatedConsents.forEach(({ permission, status, expectedStatus, expectedMessage }) => {
  test(`User has ${permission} consent with status ${status}, receive a ${expectedStatus} forbidden error`, async function ({}) {
    const { consentId, consentPutResponseStatus } =
      await createConsentAndUpdateStatus(permission, status);
    expect(consentPutResponseStatus).toEqual(status);

    const accountsGetResponse = await callGetAccounts(consentId);

    const accountsGetResponseBody = await accountsGetResponse.json();
    // I would use getAccountsResponseValidator here if the openAPISpec had full error handling response body
    expect(accountsGetResponse.status).toEqual(expectedStatus);
    expect(accountsGetResponseBody.message).toEqual(expectedMessage);
  });
});

test("User has no authorization header, receive a 401 unauthorized error", async function ({
  request,
}) {
  const accountsGetResponse = await request.get(`${BASE_URL}${ACCOUNTS_URL}`);
  const accountsGetResponseBody: GetAccountsErrorResponseObject =
    await accountsGetResponse.json();
  //I would use getAccountsResponseValidatior here if the openAPISpec had full error handling response body
  expect(accountsGetResponse.status()).toEqual(401);
  expect(accountsGetResponseBody.message).toEqual("Unauthorized");
});
