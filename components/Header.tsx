import React from 'react';
import { Button } from './ui/Button';
import type { CurrencyCode } from '../types';
import { CURRENCIES } from '../constants';

interface HeaderProps {
  onOpenCategoryManager: () => void;
  onOpenBudgetManager: () => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

// SVG logo, base64 encoded
const logoBase64 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJsb2dvR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0ZjQ2ZTU7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTBiOTgxO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSJ1cmwoI2xvZ29HcmFkaWVudCkiIC8+PHRleHQgeD0iNTAiIHk9IjYyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+TVc8L3RleHQ+PC9zdmc+`;

const Header: React.FC<HeaderProps> = ({ onOpenCategoryManager, onOpenBudgetManager, currency, setCurrency }) => {
  return (
    <header className="bg-surface shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-3">
             <img src={logoBase64} alt="MoneyWise Logo" className="h-12 w-12" />
             <span className="text-2xl font-bold text-primary">MoneyWise</span>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="currency-selector" className="sr-only">Currency</label>
              <select
                id="currency-selector"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                aria-label="Select currency"
              >
                {Object.entries(CURRENCIES).map(([code, { symbol }]) => (
                    <option key={code} value={code}>{symbol} {code}</option>
                ))}
              </select>
            </div>
            <Button onClick={onOpenBudgetManager} variant="primary">
                Manage Budgets
            </Button>
            <Button onClick={onOpenCategoryManager} variant="secondary">
                Manage Categories
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
