# frozen_string_literal: true

class UserProfilesSerializer < ActiveModel::Serializer
    type :user_profiles
    attributes :name, :about, :profile_picture
  
    belongs_to :users, serializer: ::UsersSerializer
  end