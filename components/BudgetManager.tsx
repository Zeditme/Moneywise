
import React, { useState, useEffect, useMemo } from 'react';
import type { Category, Budget } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface BudgetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  budgets: Budget[];
  setBudgetsForMonth: (newBudgets: { categoryId: string; amount: number }[], month: string) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ isOpen, onClose, categories, budgets, setBudgetsForMonth }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [budgetValues, setBudgetValues] = useState<Record<string, string>>({});

  const expenseCategories = useMemo(() => 
    categories.filter(c => c.name !== 'Salary' && c.name !== 'Freelance'), 
    [categories]
  );
  
  useEffect(() => {
    if (isOpen) {
      const currentMonthBudgets = budgets.filter(b => b.month === selectedMonth);
      const initialValues: Record<string, string> = {};
      expenseCategories.forEach(cat => {
        const existingBudget = currentMonthBudgets.find(b => b.categoryId === cat.id);
        initialValues[cat.id] = existingBudget ? String(existingBudget.amount) : '';
      });
      setBudgetValues(initialValues);
    }
  }, [isOpen, selectedMonth, budgets, expenseCategories]);

  const handleValueChange = (categoryId: string, value: string) => {
    setBudgetValues(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSave = () => {
    const newBudgets = Object.entries(budgetValues)
      .map(([categoryId, amountStr]) => ({
        categoryId,
        amount: parseFloat(amountStr) || 0,
      }))
      .filter(b => b.amount > 0);
      
    setBudgetsForMonth(newBudgets, selectedMonth);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Budgets">
        <div className="space-y-4">
            <Input
                label="Select Month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                <h3 className="font-semibold text-on-surface">Set budgets for expense categories:</h3>
                {expenseCategories.length > 0 ? expenseCategories.map(cat => (
                    <div key={cat.id} className="grid grid-cols-3 items-center gap-2">
                        <label htmlFor={`budget-${cat.id}`} className="col-span-1 truncate text-sm text-subtle">{cat.name}</label>
                        <div className="col-span-2">
                            <Input
                                id={`budget-${cat.id}`}
                                type="number"
                                placeholder="0.00"
                                value={budgetValues[cat.id] || ''}
                                onChange={(e) => handleValueChange(cat.id, e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                )) : (
                  <p className="text-center text-subtle py-4">No expense categories found.</p>
                )}
            </div>
            <Button onClick={handleSave} className="w-full">
                Save Budgets
            </Button>
        </div>
    </Modal>
  );
};

export default BudgetManager;
