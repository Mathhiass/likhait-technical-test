/**
 * Form component for adding/editing expenses
 */

import { useState } from "react";
import { ExpenseFormData } from "../types";
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { createCategory } from "../services/api";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  categories?: Array<{ id: number; name: string }>;
  onCategoryAdded?: () => void;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
  categories,
  onCategoryAdded,
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const categoryOptions = (categories || []).map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    try {
      await createCategory(newCategoryName.trim());
      setIsAddCategoryModalOpen(false);
      setNewCategoryName("");
      onCategoryAdded?.();
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Failed to add category");
    } finally {
      setIsAddingCategory(false);
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      {categories && (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <SelectBox
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              error={errors.category}
              fullWidth
              required
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setIsAddCategoryModalOpen(true)}
            style={{
              height: "fit-content",
              backgroundColor: "#f0f9ff",  // Light blue background
              border: "2px solid  #fcfcfcff", // No border
              
              color: "#3b82f6"  // Blue text
            }}
          >
            + Add Category
          </Button>
        </div>
      )}
      {!categories && (
        <SelectBox
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          error={errors.category}
          fullWidth
          required
        />
      )}

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
        max={new Date().toISOString().split('T')[0]}
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>

    <Modal
      isOpen={isAddCategoryModalOpen}
      onClose={() => {
        setIsAddCategoryModalOpen(false);
        setNewCategoryName("");
      }}
      title="Add New Category"
    >
      <div style={{ padding: "1rem 0" }}>
        <TextField
          label="Category Name"
          type="text"
          placeholder="Enter category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          fullWidth
          required
        />
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => {
              setIsAddCategoryModalOpen(false);
              setNewCategoryName("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddCategory}
            disabled={isAddingCategory || !newCategoryName.trim()}
          >
            {isAddingCategory ? "Adding..." : "Add Category"}
          </Button>
        </div>
      </div>
    </Modal>
    </div>
  );
}

