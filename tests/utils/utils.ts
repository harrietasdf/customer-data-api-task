import { generateAccountsAuthToken } from "./auth";

export const { BASE_URL, CONSENTS_URL, ACCOUNTS_URL } = process.env 

export const validAccountIds = {
  Nubank: "1234567-8",
  Itau: "8765432-1",
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
