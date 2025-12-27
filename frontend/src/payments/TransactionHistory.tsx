import React from 'react';
import { useGetTransactionsQuery } from '../store/transaction/apiTransaction';

const TransactionHistory = () => {
  const { data: transactions, isLoading } = useGetTransactionsQuery();

  if (isLoading)
    return <p className="text-center mt-6 text-gray-500">Loading transactions...</p>;

  if (!transactions?.length)
    return <p className="text-center mt-6 text-gray-500">No transactions found.</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Transaction History</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left text-gray-700 font-medium">Type</th>
            <th className="py-3 px-6 text-left text-gray-700 font-medium">Amount</th>
            <th className="py-3 px-6 text-left text-gray-700 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((tx, index) => (
            <tr
              key={tx._id}
              className={`border-b last:border-b-0 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-gray-100 transition`}
            >
              <td className="py-3 px-6">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
              <td className="py-3 px-6">${tx.amount.toFixed(2)}</td>
              <td
                className={`py-3 px-6 font-semibold ${
                  tx.status === 'COMPLETED'
                    ? 'text-green-600'
                    : tx.status === 'PENDING'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
