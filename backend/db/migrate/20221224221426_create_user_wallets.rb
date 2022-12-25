class CreateUserWallets < ActiveRecord::Migration[7.0]
  def change
    create_table :user_wallets, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.decimal :balance

      t.references :user, type: :uuid, index: true, foreign_key: {to_table: :users}
      t.timestamps
    end
  end
end