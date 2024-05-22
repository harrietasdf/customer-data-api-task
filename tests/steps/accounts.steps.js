import test, { expect } from "@playwright/test";
import {createConsentAndUpdateStatus, generateAccountsAuthToken } from "../utils/auth";
import { BASE_URL, ACCOUNTS_BASE_URL } from "../fake.env.json"

test('User with valid authentication sees an accounts list', async function ({request}) {
    const { consentId, consentPutResponseStatus } = await createConsentAndUpdateStatus("ACCOUNTS_READ", "AUTHORISED")
    expect(consentPutResponseStatus).toEqual("AUTHORISED")

    const accountsGetResponse = await request.get(`${BASE_URL}${ACCOUNTS_BASE_URL}`, {
        headers: generateAccountsAuthToken(consentId)
    })

    console.log(await accountsGetResponse.json())
})