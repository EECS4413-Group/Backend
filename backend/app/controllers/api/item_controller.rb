# frozen_string_literal: true

module Api
  class ItemController < AuthenticatedController
    # find all items owned by someone
    def index
      @items = case params_with_current_user[:type]
               when 'owned' then Item.owned
               when 'for_sale_by_owner' then Item.for_sale_by_owner
               when 'for_sale' then Item.for_sale
               end
      return render json: @items, each_serializer: ItemsSerializer, status: :ok if @items

      render body: nil, status: :not_found
    end

    # find item with specific id
    def show
      @item = Item.find_by(
        id: params[:id]
      )
      return render json: @item, serializer: ItemsSerializer, status: :ok if @item

      render body: nil, status: :not_found
    end

    def create
      item_hash = item_params_from_request.to_h
      item_hash[:current_owner] = current_user_id
      item_hash[:creator] = current_user_id
      @item = Items.new item_hash

      return render json: @item, serializer: ItemsSerializer if @item

      render json: @item.errors, status: :unprocessable_entity
    end

    def update
      @item = Item.find_by(id: params_with_current_user[:item_id])
      update_type = params_with_current_user.require(:type)
      case update_type
      when 'purchase'
        return render json: { message: 'this item is not for sale' }, status: :forbidden if @item.status != 'for_sale'

        @current_user_wallet = UserWallet.find_by(id: current_user_id)
        if (@current_user_wallet.balance - @item.price).negative?
          return render json: { message: 'insufficient funds' }, status: :forbidden
        end

        @current_user_wallet.update(balance: @current_user_wallet.balance - @item.price)
        @current_owner_wallet = UserWallet.find_by(id: @item.current_owner_id)
        @current_owner_wallet.update(balance: @current_owner_wallet.balance + @item.price)

        @item.update(current_owner_id: @current_user_wallet.id, status: 'public')

        return render json: @item, serializer: ItemsSerializer, status: :ok
      when 'gift'
        if @item.current_owner_id != current_user_id
          return render json: { message: 'can only gift items you own' }, status: :forbidden
        end

        @item.update(current_owner_id: new_owner_id)
        return render json: @item, serializer: ItemsSerializer, status: :ok
      when 'change'
        if @item.current_owner_id != current_user_id && @item.creator_id != current_user_id
          return json: { message: 'must have created and currently own item to change information' }, status: :forbidden
        end

        @item.update(item_changes)
        return render json: @item, serializer: ItemsSerializer, status: :ok
      when 'visibility'
        if @item.current_owner_id != current_user_id
          return json: { message: 'must own item to change visibility' }, status: :forbidden
        end

        @item.update(visibility_changes)
        return render json: @item, serializer: ItemsSerializer, status: :ok
      end
      render json: @item.errors, status: :unprocessable_entity
    end

    private

    def item_params_from_request
      params.require(:item).permit(:name, :price, :description, :image)
    end

    def new_owner_id
      params.require(:new_owner_id)
    end

    def item_changes
      params.require(:changes).permit(:name, :price, :description, :image)
    end

    def visibility_changes
      params.require(:changes).permit(:visibility)
    end
  end
end
