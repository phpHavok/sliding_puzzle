require 'solver'

class Api::V1::PuzzlesController < Api::V1::BaseController
  def solve
    state = JSON.parse(params[:state])
    render json: { moves: Solver.a_star(state) }
  end
end
