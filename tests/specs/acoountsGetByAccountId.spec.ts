import test, { expect } from "@playwright/test";
import { createConsentAndUpdateStatus, generateAccountsAuthToken } from "../utils/auth";
import { getAccountsResponseObject } from "../utils/accountsResponseTypes";
import { validAccountIds } from "../utils/utils";
import { getAccountsByIdResponseValidatior } from "../utils/openApiSpec";
import { base_url, accounts } from "../env.json"

test("User with valid authentication sees an accounts list", async function ({
    request,
  }) {
    const { consentId, consentPutResponseStatus } =
      await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
    expect(consentPutResponseStatus).toEqual("AUTHORISED");
  
    const accountsGetResponse = await request.get(
      `${base_url}${accounts}${validAccountIds.Itau}`,
      {
        headers: generateAccountsAuthToken(consentId),
      },
    );
  
    const accountsGetResponseBody: getAccountsResponseObject =
      await accountsGetResponse.json();
  
    const getAccountsResponseValidator = await getAccountsByIdResponseValidatior();
    const validationErrors = getAccountsResponseValidator.validateResponse(
      200,
      accountsGetResponseBody,
    );
  
    if (typeof validationErrors !== undefined) {
      console.log("Response status code:", accountsGetResponse.status());
      console.log("Response body:", accountsGetResponseBody);
    }
  
    expect(accountsGetResponse.status()).toEqual(200);
});

test("User with Invalid account ID, receive a 404 Not Found error", async function ({
  request,
}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");

  const accountsGetResponse = await request.get(
    `${base_url}${accounts}/90caf90b-f90f-440c-bacd-3b9399ca5d90`,
    {
      headers: generateAccountsAuthToken(consentId),
    },
  );

  const accountsGetResponseBody: getAccountsResponseObject =
    await accountsGetResponse.json();

  const getAccountsResponseValidator = await getAccountsByIdResponseValidatior();
  const validationErrors = getAccountsResponseValidator.validateResponse(
    404,
    accountsGetResponseBody,
  );

  if (typeof validationErrors !== undefined) {
    console.log("Response status code:", accountsGetResponse.status());
    console.log("Response body:", accountsGetResponseBody);
  }

  expect(accountsGetResponse.status()).toEqual(404);
});

test("User inputs malicious characters in account ID, receive 401 unauthorized", async function ({
  request,
}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");

  const accountsGetResponse = await request.get(
    `${base_url}${accounts}/%!@$^(%*$)}@~:><"?{}`,
    {
      headers: generateAccountsAuthToken(consentId),
    },
  );

  const accountsGetResponseBody: getAccountsResponseObject =
    await accountsGetResponse.json();

  const getAccountsResponseValidator = await getAccountsByIdResponseValidatior();
  const validationErrors = getAccountsResponseValidator.validateResponse(
    401,
    accountsGetResponseBody,
  );

  if (typeof validationErrors !== undefined) {
    console.log("Response status code:", accountsGetResponse.status());
    console.log("Response body:", accountsGetResponseBody);
  }

  expect(accountsGetResponse.status()).toEqual(401);
});