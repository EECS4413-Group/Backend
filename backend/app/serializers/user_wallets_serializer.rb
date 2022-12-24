# frozen_string_literal: true

class UserWalletsSerializer < ActiveModel::Serializer
    type :user_wallets
    attributes :balance
  
    belongs_to :users, serializer: ::UsersSerializer
  end