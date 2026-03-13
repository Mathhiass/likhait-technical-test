FactoryBot.define do
  factory :expense do
    description { "Test expense" }
    amount { 9.99 }
    category
    payer_name { "John Doe" }
    date { Date.today }
  end
end
