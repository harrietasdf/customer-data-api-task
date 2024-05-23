import test, { expect } from "@playwright/test";
import { createConsentAndUpdateStatus } from "../utils/auth";
import { callGetAccountsByAccountId, validAccountIds } from "../utils/utils";
import { getAccountsByIdResponseValidatior } from "../utils/openApiSpec";
import {
  GetAccountsByIdResponseObject,
  GetAccountsErrorResponseObject,
} from "../utils/accountsResponseTypes";

test("User with valid authentication sees an accounts list", async function ({}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");

  const accountsGetByIdResponse = await callGetAccountsByAccountId(
    consentId,
    validAccountIds.Itau,
  );

  const accountsGetByIdResponseBody: GetAccountsByIdResponseObject =
    await accountsGetByIdResponse.json();

  const getAccountsResponseValidator =
    await getAccountsByIdResponseValidatior();
  const validationErrors = getAccountsResponseValidator.validateResponse(
    200,
    accountsGetByIdResponseBody,
  );

  if (typeof validationErrors !== undefined) {
    console.log("Response status code:", accountsGetByIdResponse.status);
    console.log("Response body:", accountsGetByIdResponseBody);
  }

  expect(accountsGetByIdResponse.status).toEqual(200);
});

test("User with Invalid account ID, receive a 404 Not Found error", async function ({}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");
  const accountsGetByIdResponse = await callGetAccountsByAccountId(
    consentId,
    "90caf90b-f90f-440c-bacd-3b9399ca5d90",
  );

  const accountsGetByIdResponseBody: GetAccountsErrorResponseObject =
    await accountsGetByIdResponse.json();

  // I would use the getAccountsByIdResponseValidatior() here if the OpenAPISpec had response error handling info
  expect(accountsGetByIdResponse.status).toEqual(404);
  expect(accountsGetByIdResponseBody.message).toEqual("Not Found");
});

test("User inputs malicious characters in account ID, receive 401 unauthorized", async function ({}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");
  const accountsGetByIdResponse = await callGetAccountsByAccountId(
    consentId,
    "%!@$^(%*`$)}@~:><?{}",
  );
  const accountsGetByIdResponseBody: GetAccountsErrorResponseObject =
    await accountsGetByIdResponse.json();

  // I would use the getAccountsByIdResponseValidatior() here if the OpenAPISpec had response error handling info
  expect(accountsGetByIdResponse.status).toEqual(401);
  expect(accountsGetByIdResponseBody.message).toEqual("Unauthorized");
});