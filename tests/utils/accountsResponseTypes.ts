export type getAccountsResponseObject = {
        data: [accountsDataObject]
}

export type accountsDataObject = {
        id: string,
        bank: string,
        accountNumber: string,
        creationDateTime: string
}