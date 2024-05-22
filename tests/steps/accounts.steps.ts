import test, { expect } from "@playwright/test";
import {
  createConsentAndUpdateStatus,
  generateAccountsAuthToken,
} from "../utils/auth";
import { getAccountsResponseObject } from "../utils/accountsResponseTypes";
import { getAccountsResponseValidatior } from "../utils/openApiSpec";

test("User with valid authentication sees an accounts list", async function ({
  request,
}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED");
  expect(consentPutResponseStatus).toEqual("AUTHORISED");

  // `${process.env.BASE_URL}${process.env.ACCOUNTS_BASE_URL}`,
  const accountsGetResponse = await request.get(
    "http://localhost:8080/test-api/accounts/v1/accounts",
    {
      headers: generateAccountsAuthToken(consentId),
    },
  );

  const accountsGetResponseBody: getAccountsResponseObject =
    await accountsGetResponse.json();

  const getAccountsResponseValidator = await getAccountsResponseValidatior();
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

test("User is has rejected consent, receive a 403 forbidden error", async function ({
  request,
}) {
  const { consentId, consentPutResponseStatus } =
    await createConsentAndUpdateStatus("ACCOUNTS_READ", "REJECTED");
  expect(consentPutResponseStatus).toEqual("REJECTED");
  const accountsGetResponse = await request.get(
    "http://localhost:8080/test-api/accounts/v1/accounts",
    {
      headers: generateAccountsAuthToken(consentId),
    },
  );

  const accountsGetResponseBody: getAccountsResponseObject =
    await accountsGetResponse.json();
  const getAccountsResponseValidator = await getAccountsResponseValidatior();
  const validationErrors = getAccountsResponseValidator.validateResponse(
    403,
    accountsGetResponseBody,
  );

  if (typeof validationErrors !== undefined) {
    console.log("Response status code:", accountsGetResponse.status());
    console.log("Response body:", accountsGetResponseBody);
  }

  expect(await accountsGetResponse.status()).toEqual(403);
});

// test("User is awaiting authorization consent, receive a 403 forbidden error", async function ({
//   request,
// }) {
//   const { consentId, consentPutResponseStatus } =
//     await createConsentAndUpdateStatus("ACCOUNTS_READ", "AWAITING_AUTHORISATION");
//   expect(consentPutResponseStatus).toEqual("AWAITING_AUTHORISATION");
//   const accountsGetResponse = await request.get(
//     "http://localhost:8080/test-api/accounts/v1/accounts",
//     {
//       headers: generateAccountsAuthToken(consentId),
//     },
//   );

//   const accountsGetResponseBody: getAccountsResponseObject =
//     await accountsGetResponse.json();
//   const getAccountsResponseValidator = await getAccountsResponseValidatior();
//   const validationErrors = getAccountsResponseValidator.validateResponse(
//     403,
//     accountsGetResponseBody,
//   );

//   if (typeof validationErrors !== undefined) {
//     console.log("Response status code:", accountsGetResponse.status());
//     console.log("Response body:", accountsGetResponseBody);
//   }

//   expect(await accountsGetResponse.status()).toEqual(403);
// });
