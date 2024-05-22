import test, { expect } from "@playwright/test";
import {createConsentAndUpdateStatus, generateAccountsAuthToken } from "../utils/auth";
import { BASE_URL, ACCOUNTS_BASE_URL } from "../fake.env.json"
import { getAccountsResponseObject } from "../utils/accountsResponseTypes";

test('User with valid authentication sees an accounts list', async function ({request}) {
    const { consentId, consentPutResponseStatus } = await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED")
    expect(consentPutResponseStatus).toEqual("AUTHORISED")

    const accountsGetResponse = await request.get(`${BASE_URL}${ACCOUNTS_BASE_URL}`, {
        headers: generateAccountsAuthToken(consentId)
    })

    expect(accountsGetResponse.status()).toEqual(200)
    
    const accountsGetResponseBody: getAccountsResponseObject = await accountsGetResponse.json()
    expect(accountsGetResponseBody.data[0].id).toBeDefined()
    expect(accountsGetResponseBody.data[0].accountNumber).toBeDefined()
    expect(accountsGetResponseBody.data[0].bank).toBeDefined()
    expect(accountsGetResponseBody.data[0].creationDateTime).toBeDefined()
})