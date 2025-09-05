
import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { Transaction, Category, Budget, CurrencyCode } from '../types';
import { TransactionType } from '../types';
import { Card } from './ui/Card';
import { CURRENCIES } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  currency: CurrencyCode;
}

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

const getProgressBarColor = (spent: number, budget: number) => {
    if (budget === 0) return 'bg-gray-400';
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return 'bg-danger';
    if (percentage > 75) return 'bg-yellow-500';
    return 'bg-secondary';
};


const Dashboard: React.FC<DashboardProps> = ({ transactions, categories, budgets, currency }) => {
  const currencySymbol = CURRENCIES[currency].symbol;

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const data: { name: string; value: number }[] = [];
    const categoryMap = new Map<string, number>();

    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        categoryMap.set(t.categoryId, (categoryMap.get(t.categoryId) || 0) + t.amount);
      });
      
    categoryMap.forEach((value, categoryId) => {
      const category = categories.find(c => c.id === categoryId);
      data.push({ name: category ? category.name : 'Uncategorized', value });
    });

    return data;
  }, [transactions, categories]);

  const budgetStatus = useMemo(() => {
    if (transactions.length === 0) return [];
    
    const latestDate = new Date(Math.max(...transactions.map(t => new Date(t.date).getTime())));
    const month = latestDate.toISOString().slice(0, 7);

    const relevantBudgets = budgets.filter(b => b.month === month);
    if (relevantBudgets.length === 0) return [];

    const expenseMap = new Map<string, number>();
    transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.date.startsWith(month))
      .forEach(t => {
        expenseMap.set(t.categoryId, (expenseMap.get(t.categoryId) || 0) + t.amount);
      });

    return relevantBudgets.map(budget => {
        const category = categories.find(c => c.id === budget.categoryId);
        const spent = expenseMap.get(budget.categoryId) || 0;
        return {
            name: category ? category.name : 'Uncategorized',
            budget: budget.amount,
            spent,
        };
    }).sort((a,b) => (b.spent/b.budget) - (a.spent/a.budget));
  }, [transactions, budgets, categories]);

  const currentMonthDisplay = useMemo(() => {
    if (transactions.length > 0) {
      const latestDate = new Date(Math.max(...transactions.map(t => new Date(t.date).getTime())));
      return latestDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [transactions]);


  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
                <h3 className="text-lg font-semibold text-subtle">Total Income</h3>
                <p className="text-3xl font-bold text-secondary">{currencySymbol}{totalIncome.toFixed(2)}</p>
            </Card>
            <Card className="text-center">
                <h3 className="text-lg font-semibold text-subtle">Total Expense</h3>
                <p className="text-3xl font-bold text-danger">{currencySymbol}{totalExpense.toFixed(2)}</p>
            </Card>
            <Card className="text-center">
                <h3 className="text-lg font-semibold text-subtle">Balance</h3>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-on-surface' : 'text-danger'}`}>
                  {currencySymbol}{balance.toFixed(2)}
                </p>
            </Card>
        </div>

        {budgetStatus.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold mb-4">Budget Status ({currentMonthDisplay})</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {budgetStatus.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-subtle">{currencySymbol}{item.spent.toFixed(2)} / <span className="font-medium text-on-surface">{currencySymbol}{item.budget.toFixed(2)}</span></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${getProgressBarColor(item.spent, item.budget)} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min((item.spent / item.budget) * 100, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={item.spent}
                      aria-valuemin={0}
                      aria-valuemax={item.budget}
                      aria-label={`${item.name} budget progress`}
                    ></div>
                  </div>
                  {item.spent > item.budget && (
                    <p className="text-right text-sm text-danger mt-1">
                      Overspent by {currencySymbol}{(item.spent - item.budget).toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
          {expenseByCategory.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${currencySymbol}${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-subtle">No expense data to display for the selected period.</p>
          )}
        </Card>
    </div>
  );
};

export default Dashboard;
