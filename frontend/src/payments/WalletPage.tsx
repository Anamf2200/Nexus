import React, { useState } from 'react';
import DepositForm from './DepositForm';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';
import WithdrawForm from './WithdrawForm';

const WalletPage = () => {
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'transfer' | 'history'>('deposit');

  const tabs = ['deposit', 'withdraw', 'transfer', 'history'] as const;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg ">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Wallet</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-t-lg font-medium transition
              ${
                tab === t
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tab === 'deposit' && <DepositForm />}
        {tab === 'withdraw' && <WithdrawForm />}
        {tab === 'transfer' && <TransferForm />}
        {tab === 'history' && <TransactionHistory />}
      </div>
    </div>
  );
};

export default WalletPage;
