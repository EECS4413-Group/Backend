class CreateUserProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :user_profiles, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :name
      t.text :about
      t.text :profile_picture

      t.references :user, type: :uuid, index: true, foreign_key: {to_table: :users}
      t.timestamps
    end
  end
end
