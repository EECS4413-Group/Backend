# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :authenticate_user!

  def params_with_current_user
    jsonapi_params_to_query_options.merge!(current_user: current_user)
  end

  def current_user_id
    params_with_current_user[:current_user].id
  end
end
