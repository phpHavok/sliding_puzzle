Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'puzzles#show'

  get 'api/v1/puzzles/solve', to: 'api/v1/puzzles#solve'
end
