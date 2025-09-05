
import React, { useState } from 'react';
import type { Category } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  addCategory: (name: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose, categories, addCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && !categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    } else {
      alert("Category already exists or name is invalid.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Existing Categories</h3>
          <div className="max-h-48 overflow-y-auto bg-gray-100 p-2 rounded-md flex flex-wrap gap-2">
            {categories.map(c => (
              <span key={c.id} className="bg-primary text-white px-2 py-1 text-sm rounded-full">
                {c.name}
              </span>
            ))}
          </div>
        </div>
        <form onSubmit={handleAddCategory} className="space-y-2">
          <Input 
            label="New Category Name"
            id="newCategory"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g., Investments"
          />
          <Button type="submit" className="w-full" variant="secondary">
            Add Category
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default CategoryManager;
