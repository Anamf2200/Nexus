export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type TransactionType = 'deposit' | 'withdraw' | 'transfer';

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
}
