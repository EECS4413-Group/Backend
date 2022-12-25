# frozen_string_literal: true

module Api
  class UserProfileController < AuthenticatedController
    def create
      @user_profile = UserProfile.find_by(id: current_user_id)
      return render json: { message: 'user already has a profile' }, status: :forbidden if @user_profile

      @user_profile = UserProfile.new(profile_params)
      @user_profile.user_id = current_user_id
      return render json: @user_profile, serializer: UserProfilesSerializer, status: :created if @user_profile.save

      render json: nil, status: :unprocessable_entity
    end

    def update
      @user_profile = UserProfile.find_by(id: current_user_id)
      return render json: { message: 'no profile exists for user' }, status: :forbidden unless @user_profile

      @user_profile.update(profile_params)
      render json: @user_profile, serializer: UserProfilesSerializer, status: :ok
    end

    private

    def profile_params
      params.require(:user_profile).permit(:name, :about, :profile_picture)
    end
  end
end
