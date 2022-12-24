class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :name
      t.decimal :price
      t.text :description
      t.text :image
      t.string :status

      t.references :current_owner, type: :uuid, index: true, foreign_key: {to_table: :users}
      t.references :creator, type: :uuid, index: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
