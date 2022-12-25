# frozen_string_literal: true

class UsersSerializer < ActiveModel::Serializer
  type :users
  attributes :id

  has_one :user_wallet, serializer: ::UserWalletsSerializer
  has_one :user_profile, serializer: ::UserProfilesSerializer
  has_many :items, serializer: ::ItemsSerializer, foreign_key: :current_owner
end
