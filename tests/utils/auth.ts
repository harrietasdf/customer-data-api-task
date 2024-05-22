import { BASE_URL, CONSENTS_BASE_URL } from "../fake.env.json"
import fetch from 'node-fetch'

const encodeHeader = () => {
    const headerData = '{"alg": "none","typ": "JWT"}'
    // eslint-disable-next-line no-undef
    return Buffer.from(headerData).toString('base64')
}

const encodeConsentsPayload = () => {
    const consentPayloadData = '{"scope": "consents","client_id": "client1"}'
    // eslint-disable-next-line no-undef
    return Buffer.from(consentPayloadData).toString('base64')
}

const encodeAccountsPayload = (consentId) => {
    const accountsPayloadData = `{"scope": "consents consent:${consentId}","client_id": "client1"}`
    // eslint-disable-next-line no-undef
    return Buffer.from(accountsPayloadData).toString('base64')
}

const authToken = (authHeader, authPayload) => {
    return `Bearer ${authHeader}.${authPayload}.`
}
const consentAuthToken = authToken(encodeHeader(), encodeConsentsPayload())

// Function to generate accounts authorization token
export const generateAccountsAuthToken = (consentId: string) => {
    return {"Authorization": `${authToken(encodeHeader(), encodeAccountsPayload(consentId))}`}
};

export const consentHeaderObject = {
    "Authorization": consentAuthToken,
    "Content-Type": "application/json"
}

const consentAccountReadPostRequestObject = (permission) => {
        return { 
            "data": {
                "permissions": `${permission}`,
                "expirationDateTime": "2024-12-21T13:54:31Z"
        }
    }
}

export const consentPostRequestBody = (permission) =>  JSON.stringify(consentAccountReadPostRequestObject(permission))

const consentUpdateToAuthorisedRequestObject = (authorization) => {
    return {
        "data": {
            "status": `${authorization}`
        } 
    }
}

export const consentPutToAuthorisedRequestBody = (authorization) => JSON.stringify(consentUpdateToAuthorisedRequestObject(authorization))

const consentUrl = `${BASE_URL}${CONSENTS_BASE_URL}`

export async function createConsentAndUpdateStatus(permission, authorization) {
    // Post request to create consent
    const consentPostResponse = await fetch(consentUrl, {
        method: "POST",
        headers: consentHeaderObject,
        body: consentPostRequestBody(permission)
    })

    // Check if the POST request was successful
    if (!consentPostResponse.ok) {
        throw new Error(`POST request failed: ${consentPostResponse.status} ${consentPostResponse.statusText}`)
    }
    const consentPostResponseBody = await consentPostResponse.json()
    const consentId = consentPostResponseBody.data.consentId

    // Put request to update consent status
    const consentPutResponse = await fetch(`${consentUrl}${consentId}`, {
        method: "PUT",
        headers: consentHeaderObject,
        body: consentPutToAuthorisedRequestBody(authorization)
    })

    // Check if the PUT request was successful
    if (!consentPutResponse.ok) {
        throw new Error(`PUT request failed: ${consentPostResponse.status} ${consentPostResponse.statusText}`);
    }

    const putResponseBody = await consentPutResponse.json()
    const consentPutResponseStatus = putResponseBody.data.status

    return { consentId, consentPutResponseStatus }
}
