import test, { expect } from "@playwright/test";
import { createConsentAndUpdateStatus, generateAccountsAuthToken } from "../utils/auth";
import { getAccounts200ResponseObject } from "../utils/accountsResponseTypes";
import { callGetAccountsByAccountId, validAccountIds } from "../utils/utils";
import { getAccountsByIdResponseValidatior } from "../utils/openApiSpec";
import { base_url, accounts } from "../env.json"

test("User with valid authentication sees an accounts list", async function ({
    request,
  }) {
    const { consentId, consentPutResponseStatus } =
      await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
    expect(consentPutResponseStatus).toEqual("AUTHORISED");
  
    const accountsGetResponse = callGetAccountsByAccountId(consentId, validAccountIds.Itau)
  
    const accountsGetResponseBody =
      (await accountsGetResponse).body
  
    const getAccountsResponseValidator = await getAccountsByIdResponseValidatior();
    const validationErrors = getAccountsResponseValidator.validateResponse(
      200,
      accountsGetResponseBody,
    );
  
    if (typeof validationErrors !== undefined) {
      console.log("Response status code:", (await accountsGetResponse).status);
      console.log("Response body:", accountsGetResponseBody);
    }
  
    expect((await accountsGetResponse).status).toEqual(200);
});

test("User with Invalid account ID, receive a 404 Not Found error", async function ({
}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");
  const accountsGetResponse = callGetAccountsByAccountId(consentId,  "90caf90b-f90f-440c-bacd-3b9399ca5d90")
  
  const accountsGetResponseBody =
    (await accountsGetResponse).body

  // I would use the getAccountsByIdResponseValidatior() here if the OpenAPISpec had response error handling info
  expect((await accountsGetResponse).status).toEqual(404);
  expect(accountsGetResponseBody).toEqual("Not Found")
});

test("User inputs malicious characters in account ID, receive 401 unauthorized", async function ({
  request,
}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");
  const accountsGetResponse = callGetAccountsByAccountId(consentId,  "%!@$^(%*`$)}@~:><?{}")
  
  const accountsGetResponseBody =
    (await accountsGetResponse).body
    
  // I would use the getAccountsByIdResponseValidatior() here if the OpenAPISpec had response error handling info
  expect((await accountsGetResponse).status).toEqual(401);
  expect(accountsGetResponseBody).toEqual("Unauthorized")
});