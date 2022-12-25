Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  resources :users
  namespace :api do
    resources :user_wallets, only: %i[show update]
    get '/user_profiles/me', to: 'user_profiles#show'
    resources :user_profiles, only: %i[create update]
    resources :items, except: %i[destroy]
  end
end
