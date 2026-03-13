class Api::ExpensesController < ApplicationController
  def index
    # always show newest items first; primary sort is by the user-specified
    # `date` (so that the table groups by calendar day), but for records that
    # share the same date we fall back to the creation timestamp (or id) so
    # that the item the user just added will appear at the top of the list
    # even if its amount is smaller than other entries for that day.
    #
    # Previously we only ordered by `date`, which meant a new expense with a
    # smaller amount could end up below existing expenses for the same date.
    # Real users expect “newest first”, so include `created_at` as a secondary
    # sort key.
    expenses = Expense.includes(:category).order(date: :desc, created_at: :desc)

    if params[:year].present? && params[:month].present?
      year = params[:year].to_i
      month = params[:month].to_i

      start_date = Date.new(year, month, 1)
      end_date = start_date.end_of_month

      expenses = expenses.where(date: start_date..end_date)
    end

    render json: expenses.map { |expense| format_expense(expense) }
  end

  def create
    expense = Expense.new(expense_params)

    # If date is provided, parse it
    if params[:expense][:date].present?
      expense.date = Date.parse(params[:expense][:date])
    end

    if expense.save
      render json: format_expense(expense), status: :created
    else
      render json: { errors: expense.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    expense = Expense.find(params[:id])

    if expense.update(expense_params)
      render json: format_expense(expense)
    else
      render json: { errors: expense.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    expense = Expense.find(params[:id])
    expense.destroy
    head :no_content
  end

  private

  def expense_params
    params.require(:expense).permit(:description, :amount, :category_id, :payer_name, :date)
  end

  def format_expense(expense)
    {
      id: expense.id,
      description: expense.description,
      amount: expense.amount.to_f,
      category: expense.category.name,
      payer_name: expense.payer_name,
      date: expense.date.to_s,
      created_at: expense.created_at,
      updated_at: expense.updated_at
    }
  end
end
