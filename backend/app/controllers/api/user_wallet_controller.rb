# frozen_string_literal: true

module Api
  class UserWalletController < AuthenticatedController
    def show
      @user_wallet = UserWallet.find_by(id: current_user_id)
      return render json: @user_wallet, serializer: UserWalletsSerializer, status: :ok if @user_wallet
    end

    def update
      case update_type
      when 'redeem'
        @user_wallet = UserWallet.find_by(id: current_user_id)
        @user_wallet.update(balance: @user_wallet.balance + 500.0)
        return render json: @user_wallet, serializer: UserWalletsSerializer, status: :ok
      when 'deposit'
      # TODO
      when 'code'
        # TODO
      end
      render json: nil, status: :unprocessable_entity
    end

    private

    def update_type
      params.require('type')
    end
  end
end
