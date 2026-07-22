export interface FiscalYear {
  companyCode: string;
  companyName: string;
  financialYear: string;
  startFinancialYear: string;
  endFinancialYear: string;
  transferCoding: boolean;
}
export interface FiscalYearParameters {
  companyName: string;
  groupCodeLength: number;
  generalCodeLength: number;
  subsidiaryCodeLength: number;
  detailCodeLength: number;
}



export interface FiscalYearParametersResponse {
  companyCode: string;
  companyName: string;
  groupCodeLength: number;
  generalCodeLength: number;
  generalCodeFullLength: number;
  subsidiaryCodeLength: number;
  subsidiaryCodeFullLength: number;
  detailCodeLength: number;
  fiscalYear: string;
  fiscalYearStartDate: string;
  fiscalYearEndDate: string;
  dtFiscalYearStartDate: string;
  dtFiscalYearEndDate: string;
}

export interface DatabaseBackup {
  data: {
    backupPath: string;
  }
}


