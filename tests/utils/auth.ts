import { fetch } from "fetch-h2";
import { base_url, consents } from "../env.json";
import { expect } from "@playwright/test";

const encodeHeader = () => {
  const headerData = '{"alg": "none","typ": "JWT"}';
  // eslint-disable-next-line no-undef
  return Buffer.from(headerData).toString("base64");
};

const encodeConsentsPayload = () => {
  const consentPayloadData = '{"scope": "consents","client_id": "client1"}';
  // eslint-disable-next-line no-undef
  return Buffer.from(consentPayloadData).toString("base64");
};

const encodeAccountsPayload = (consentId: string) => {
  const accountsPayloadData = `{"scope": "consents consent:${consentId}","client_id": "client1"}`;
  // eslint-disable-next-line no-undef
  return Buffer.from(accountsPayloadData).toString("base64");
};

const authToken = (authHeader: string, authPayload: string) => {
  return `Bearer ${authHeader}.${authPayload}.`;
};
const consentAuthToken = authToken(encodeHeader(), encodeConsentsPayload());

// Function to generate accounts authorization token
export const generateAccountsAuthToken = (consentId: string) => {
  return {
    Authorization: `${authToken(encodeHeader(), encodeAccountsPayload(consentId))}`,
  };
};

export const consentHeaderObject = {
  Authorization: consentAuthToken,
  "Content-Type": "application/json",
};

const consentAccountReadPostRequestObject = (permission: string) => {
  return {
    data: {
      permissions: `${permission}`,
      expirationDateTime: "2024-12-21T13:54:31Z",
    },
  };
};

export const consentPostRequestBody = (permission: string) =>
  JSON.stringify(consentAccountReadPostRequestObject(permission));

const consentUpdateToAuthorisedRequestObject = (authorization: string) => {
  return {
    data: {
      status: `${authorization}`,
    },
  };
};

export const consentPutToAuthorisedRequestBody = (authorization: string) =>
  JSON.stringify(consentUpdateToAuthorisedRequestObject(authorization));

const consentUrl = `${base_url}${consents}`;

export async function createConsentAndUpdateStatus(
  permission: string,
  authorization: string,
) {
  // Post request to create consent
  const consentPostResponse = await fetch(consentUrl, {
    method: "POST",
    headers: consentHeaderObject,
    body: consentPostRequestBody(permission),
  });

  // Check if the POST request was successful
  if (!consentPostResponse.ok) {
    throw new Error(
      `POST request failed: ${consentPostResponse.status} ${consentPostResponse.statusText}`,
    );
  }
  const consentPostResponseBody = await consentPostResponse.json();
  const consentId = consentPostResponseBody.data.consentId;

  // Put request to update consent status
  const consentPutResponse = await fetch(`${consentUrl}/${consentId}`, {
    method: "PUT",
    headers: consentHeaderObject,
    body: consentPutToAuthorisedRequestBody(authorization),
  });

  // Check if the PUT request was successful
  if (!consentPutResponse.ok) {
    throw new Error(
      `PUT request failed: ${consentPutResponse.status} ${consentPutResponse.statusText}`,
    );
  }

  const putResponseBody = await consentPutResponse.json();
  const consentPutResponseStatus = putResponseBody.data.status;

  return { consentId, consentPutResponseStatus };
}

export async function createConsent(permission: string) {
  // Post request to create consent
  const consentPostResponse = await fetch(consentUrl, {
    method: "POST",
    headers: consentHeaderObject,
    body: consentPostRequestBody(permission),
  });

  // Check if the POST request was successful
  if (!consentPostResponse.ok) {
    throw new Error(
      `POST request failed: ${consentPostResponse.status} ${consentPostResponse.statusText}`,
    );
  }
  const consentPostResponseBody = await consentPostResponse.json();
  const consentPostResponseStatus = consentPostResponseBody.data.status;
  const consentId = consentPostResponseBody.data.consentId;
  return { consentId, consentPostResponseStatus };
}
