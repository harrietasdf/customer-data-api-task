import { generateAccountsAuthToken } from "./auth";
import { base_url, accounts } from "../env.json";

export const validAccountIds = {
  Nubank: "87caf37b-f70f-440c-bacd-3b9399ca5d74",
  Itau: "6565ab61-b27e-41e4-9ca2-f3ba83dbb669",
};

export const callGetAccounts = async (consentId: string) => {
  const accountsGetResponse = await fetch(`${base_url}${accounts}`, {
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
    `${base_url}${accounts}/${accountId}`,
    {
      method: "GET",
      headers: generateAccountsAuthToken(consentId),
    },
  );
  return accountsByIdGetResponse;
};
