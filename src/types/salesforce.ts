export interface SalesforceAccount {
  accountName: string;
  accountId: string;
}

export interface SalesforceMachine {
  machineId: string;
  machineName: string;
  region: null | string;
  serialNumber: string;
  sfAccountId: string;
}
