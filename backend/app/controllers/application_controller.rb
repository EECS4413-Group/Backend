# frozen_string_literal: true

class ApplicationController < ActionController::API
  protect_from_forgery unless: -> { request.format.json? }

  def jsonapi_params_to_query_options
    params.merge!(inclusions: inclusions_params) if inclusions_params.present?
    params.merge!(sort: sort_params) if sort_params.present?
    params.merge!(filters: filter_params) if filter_params.present?
    params
  end
end
