
import React, { useState } from 'react';
import type { Transaction, Category } from '../types';
import { TransactionType } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

interface TransactionFormProps {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ addTransaction, categories }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[1]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !description || !categoryId) {
      alert('Please fill all fields');
      return;
    }

    addTransaction({
      type,
      amount: parseFloat(amount),
      date,
      description,
      categoryId,
    });

    setAmount('');
    setDescription('');
  };
  
  const incomeCategories = categories.filter(c => c.name === 'Salary' || c.name === 'Freelance');
  const expenseCategories = categories.filter(c => c.name !== 'Salary' && c.name !== 'Freelance');

  const availableCategories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;
  
  React.useEffect(() => {
     setCategoryId(availableCategories[0]?.id || '');
  }, [type, categories]);


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2 rounded-lg bg-gray-200 p-1">
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${type === TransactionType.EXPENSE ? 'bg-danger text-white shadow' : 'text-subtle'}`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${type === TransactionType.INCOME ? 'bg-secondary text-white shadow' : 'text-subtle'}`}
        >
          Income
        </button>
      </div>

      <Input
        label="Amount"
        id="amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        required
      />
      <Input
        label="Description"
        id="description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Coffee"
        required
      />
      <Select
        label="Category"
        id="category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        {availableCategories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </Select>
      <Input
        label="Date"
        id="date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Add Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;
