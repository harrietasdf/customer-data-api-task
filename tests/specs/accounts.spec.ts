import test, { expect } from "@playwright/test";
import { createConsent, createConsentAndUpdateStatus } from "../utils/auth";
import {
  GetAccounts200ResponseObject,
  GetAccountsErrorResponseObject,
} from "../utils/accountsResponseTypes";
import { getAccountsResponseValidatior } from "../utils/openApiSpec";
import { ACCOUNTS_URL, BASE_URL, callGetAccounts } from "../utils/utils";

test("User with valid authentication sees an accounts list", async function ({}) {
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

test("User has rejected consent, receive a 403 forbidden error", async function ({}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "REJECTED");
  expect(consentPutResponseStatus).toEqual("REJECTED");

  const accountsGetResponse = await callGetAccounts(consentId);

  const accountsGetResponseBody: GetAccountsErrorResponseObject =
    await accountsGetResponse.json();
  //I would use getAccountsResponseValidatior here if the openAPISpec had full error handling response body
  expect(accountsGetResponse.status).toEqual(403);
  expect(accountsGetResponseBody.message).toEqual("Forbidden");
});

test("User has awaiting authorization consent, receive a 403 forbidden error", async function ({}) {
  const { consentId, consentPostResponseStatus } =
    await createConsent("ACCOUNTS_READ");
  expect(consentPostResponseStatus).toEqual("AWAITING_AUTHORISATION");

  const accountsGetResponse = await callGetAccounts(consentId);

  const accountsGetResponseBody: GetAccountsErrorResponseObject =
    await accountsGetResponse.json();
  //I would use getAccountsResponseValidatior here if the openAPISpec had full error handling response body
  expect(accountsGetResponse.status).toEqual(403);
  expect(accountsGetResponseBody.message).toEqual("Forbidden");
});

test("User has credit card read consent, receive a 403 forbidden error", async function ({}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("CREDIT_CARD_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");

  const accountsGetResponse = await callGetAccounts(consentId);

  const accountsGetResponseBody: GetAccountsErrorResponseObject =
    await accountsGetResponse.json();
  //I would use getAccountsResponseValidatior here if the openAPISpec had full error handling response body
  expect(accountsGetResponse.status).toEqual(403);
  expect(accountsGetResponseBody.message).toEqual("Forbidden");
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
