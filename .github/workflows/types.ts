
export interface Trip {
  id: string;
  customerName: string;
  customerPhone: string;
  earnings: number;
  date: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

export interface Customer {
    name: string;
    phone: string;
    tripCount: number;
    totalEarnings: number;
}

export enum View {
  Dashboard = 'DASHBOARD',
  Log = 'LOG',
  Analytics = 'ANALYTICS',
  Customers = 'CUSTOMERS',
}
