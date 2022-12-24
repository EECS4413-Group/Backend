class Api::ItemController < AuthenticatedController

    # find all items owned by someone
    def index

    end

    # find item with specific id
    def show
        @item = Item.find_by(
            id: params[:id]
        )
        if @item
            return render json: @item, serializer: ItemsSerializer, status: :ok
        end
        render body: nil, status: :not_found
    end

    def create

    end

    def update

    end
end
