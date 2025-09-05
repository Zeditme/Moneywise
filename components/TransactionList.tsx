
import React from 'react';
import type { Transaction, Category, Filters, CurrencyCode } from '../types';
import { TransactionType } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { CURRENCIES } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
  categories: Category[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  currency: CurrencyCode;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const FilterControls: React.FC<Pick<TransactionListProps, 'filters' | 'setFilters' | 'categories'>> = ({ filters, setFilters, categories }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <Input
        label="From"
        type="date"
        name="dateFrom"
        value={filters.dateFrom}
        onChange={handleFilterChange}
      />
      <Input
        label="To"
        type="date"
        name="dateTo"
        value={filters.dateTo}
        onChange={handleFilterChange}
      />
      <Select
        label="Type"
        name="type"
        value={filters.type}
        onChange={handleFilterChange}
      >
        <option value="all">All</option>
        <option value={TransactionType.INCOME}>Income</option>
        <option value={TransactionType.EXPENSE}>Expense</option>
      </Select>
      <Select
        label="Category"
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <option value="all">All</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Select>
    </div>
  );
};


const TransactionList: React.FC<TransactionListProps> = ({ transactions, deleteTransaction, categories, filters, setFilters, currency }) => {
  const currencySymbol = CURRENCIES[currency].symbol;

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'N/A';
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Transactions History</h2>
      <FilterControls filters={filters} setFilters={setFilters} categories={categories} />
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {transactions.length > 0 ? (
          transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-10 rounded-full ${t.type === TransactionType.INCOME ? 'bg-secondary' : 'bg-danger'}`}></div>
                <div>
                  <p className="font-semibold">{t.description}</p>
                  <p className="text-sm text-subtle">{getCategoryName(t.categoryId)} - {new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-secondary' : 'text-danger'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                </p>
                <button onClick={() => deleteTransaction(t.id)} className="text-subtle hover:text-danger">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-subtle py-8">No transactions found for the selected filters.</p>
        )}
      </div>
    </Card>
  );
};

export default TransactionList;
