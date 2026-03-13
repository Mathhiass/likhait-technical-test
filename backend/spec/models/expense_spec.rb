require 'rails_helper'

RSpec.describe Expense, type: :model do
  let(:category) { create(:category) }

  describe 'validations' do
    it 'is valid with valid attributes' do
      expense = build(:expense, category: category)
      expect(expense).to be_valid
    end

    it 'is invalid without a description' do
      expense = build(:expense, description: nil, category: category)
      expect(expense).not_to be_valid
      expect(expense.errors[:description]).to include("can't be blank")
    end

    it 'is invalid without an amount' do
      expense = build(:expense, amount: nil, category: category)
      expect(expense).not_to be_valid
      expect(expense.errors[:amount]).to include("can't be blank")
    end

    it 'is invalid with a negative amount' do
      expense = build(:expense, amount: -10, category: category)
      expect(expense).not_to be_valid
      expect(expense.errors[:amount]).to include("must be greater than 0")
    end

    it 'is invalid without a category' do
      expense = build(:expense, category: nil)
      expect(expense).not_to be_valid
      expect(expense.errors[:category_id]).to include("can't be blank")
    end

    it 'is invalid without a payer name' do
      expense = build(:expense, payer_name: nil, category: category)
      expect(expense).not_to be_valid
      expect(expense.errors[:payer_name]).to include("can't be blank")
    end

    it 'is invalid without a date' do
      expense = build(:expense, date: nil, category: category)
      expect(expense).not_to be_valid
      expect(expense.errors[:date]).to include("can't be blank")
    end

    it 'is invalid with a future date' do
      future_date = Date.today + 1.day
      expense = build(:expense, date: future_date, category: category)
      expect(expense).not_to be_valid
      expect(expense.errors[:date]).to include("cannot be in the future")
    end

    it 'is valid with today\'s date' do
      expense = build(:expense, date: Date.today, category: category)
      expect(expense).to be_valid
    end

    it 'is valid with a past date' do
      past_date = Date.today - 1.day
      expense = build(:expense, date: past_date, category: category)
      expect(expense).to be_valid
    end
  end
end
