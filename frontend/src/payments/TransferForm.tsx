import React, { useState } from 'react';
import { useTransferMutation } from '../store/transaction/apiTransaction';
import { Button } from '../components/ui/Button';

const TransferForm = () => {
  const [amount, setAmount] = useState(0);
  const [transfer, { isLoading }] = useTransferMutation();

  const handleTransfer = async () => {
    if (amount <= 0) return alert('Enter a valid amount');
    await transfer({ amount, type: 'transfer' });
    setAmount(0);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800 text-center">Transfer Money</h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Button
        onClick={handleTransfer}
        disabled={isLoading}
        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
      >
        {isLoading ? 'Processing...' : 'Transfer'}
      </Button>
    </div>
  );
};

export default TransferForm;
