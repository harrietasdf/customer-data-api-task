export type getAccounts200ResponseObject = {
  data: [accountsDataObject];
};

export type accountsDataObject = {
  id: string;
  bank: string;
  accountNumber: string;
  creationDateTime: string;
};

export type getAccountsErrorResponseObject = {
  message: string
}