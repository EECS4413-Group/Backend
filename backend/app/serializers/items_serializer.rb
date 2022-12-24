# frozen_string_literal: true

class ItemsSerializer < ActiveModel::Serializer
    type :items
    attributes :name, :price, :description,:image,
    
    belongs_to :users, serializer: ::UsersSerializer, key: :current_owner
    belongs_to :users, serializer: ::UsersSerializer, key: :creator 
end