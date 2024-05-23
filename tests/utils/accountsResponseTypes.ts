export type GetAccounts200ResponseObject = {
  data: [AccountsDataObject];
};

export type AccountsDataObject = {
  id: string;
  bank: string;
  accountNumber: string;
  creationDateTime: string;
};

export type GetAccountsErrorResponseObject = {
  message: string;
};

export type GetAccountsByIdResponseObject = {
  data: {
    id: string;
    bank: string;
    accountNumber: string;
    creationDateTime: string;
  };
};
