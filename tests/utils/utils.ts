import { generateAccountsAuthToken } from "./auth";

export const { BASE_URL, CONSENTS_URL, ACCOUNTS_URL } = process.env 

export const validAccountIds = {
  Nubank: "87caf37b-f70f-440c-bacd-3b9399ca5d74",
  Itau: "6565ab61-b27e-41e4-9ca2-f3ba83dbb669",
};

export const callGetAccounts = async (consentId: string) => {
  const accountsGetResponse = await fetch(`${BASE_URL}${ACCOUNTS_URL}`, {
    method: "GET",
    headers: generateAccountsAuthToken(consentId),
  });
  return accountsGetResponse;
};

export const callGetAccountsByAccountId = async (
  consentId: string,
  accountId: string,
) => {
  const accountsByIdGetResponse = await fetch(
    `${BASE_URL}${ACCOUNTS_URL}/${accountId}`,
    {
      method: "GET",
      headers: generateAccountsAuthToken(consentId),
    },
  );
  return accountsByIdGetResponse;
};
