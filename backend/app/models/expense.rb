class Expense < ApplicationRecord
  belongs_to :category

  validates :description, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :category_id, presence: true
  validates :payer_name, presence: true
  validates :date, presence: true

  validate :date_not_in_future

  private

  def date_not_in_future
    if date.present? && date > Date.today
      errors.add(:date, "cannot be in the future")
    end
  end
end
