Rails.application.routes.draw do
  get '/locations/search' => 'locations#search', :as => 'locations_search'

  resources :locations

  resources :requests

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
