# frozen_string_literal: true

class Item < ApplicationRecord
  scope :owned, ->(owner_id) { where(current_owner_id: owner_id) }
  scope :for_sale_by_owner, ->(owner_id) { where(current_owner_id: owner_id, status: 'for_sale') }
end
