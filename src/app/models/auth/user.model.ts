import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';

export interface UserModel extends AuthModel {
  id: number;
  companyCode: string;
  fourCharsFinancialYear: string;
  twoCharsFiscalYear: string;
  fiscalYearParameters: FiscalYearParameters;
  username: string;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  role: string;
  roles: number[];
  accessList: string[];
  occupation: string;
  companyName: string;
  phone: string;
  address?: AddressModel;
  
  // Personal information
  name: string;
  firstname: string;
  lastname: string;
  website: string;
  
  // Account information
  logoUrl: string;
  language: string;
  timeZone: string;
  isAdmin: boolean;
  reservationServersInfo: ReservationServersInfo[];
}
export interface FiscalYearParameters {
  companyCode: number;
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
  logoUrl: string;
}

export interface ReservationServersInfo {
  serverAddress: string;
  id: number;
  title: string;
}
