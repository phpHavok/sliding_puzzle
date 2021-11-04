require_relative 'priority_queue'

class PuzzleNode
  include Comparable

  ROWS = 3
  COLS = 3
  SLIDER = ROWS * COLS

  attr_reader :state
  attr_accessor :f, :g, :parent

  def initialize(state, goal:)
    # TODO: add parent and G
    # TODO: ensure state is correct
    @state = state
    @goal = goal
    @f = Float::INFINITY
    @g = Float::INFINITY
    @parent = nil
  end

  def heuristic
    @state
      .each_with_index
      .map do |value, index|
        if value == SLIDER
          0
        else
          current_coords = index.divmod(COLS)
          target_coords = @goal.index(value).divmod(COLS)
          current_coords
            .zip(target_coords)
            .map { |c, t| (c - t).abs }
            .reduce(:+)
        end
      end
      .reduce(:+)
  end

  def to_s
    str = ''
    @state.each_with_index do |value, i|
      str << value.to_s + ' '
      str << "\n" if i % 3 == 2
    end
    str
  end

  def <=>(other)
    # TODO: verify?
    return 0 if @state == other.state
    return -1 if heuristic < other.heuristic
    return 1
  end

  def neighbors
    slider_index = @state.index(SLIDER)
    potential_moves = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    potential_moves
      .map { |move| [move, slider_index.divmod(COLS)].transpose.map(&:sum) }
      .reject { |r, c| r < 0 || r >= ROWS || c < 0 || c >= COLS }
      .map do |r, c|
        i = r * ROWS + c
        neighbor = @state.clone
        neighbor[slider_index], neighbor[i] =
          neighbor[i], neighbor[slider_index]
        neighbor
      end
  end

  def diff(prior)
    p_r, p_c = prior.state.index(SLIDER).divmod(COLS)
    c_r, c_c = @state.index(SLIDER).divmod(COLS)
    d_r, d_c = c_r - p_r, c_c - p_c
    number = prior.state[@state.index(SLIDER)]
    case [d_r, d_c]
    when [-1, 0]
      "#{number} goes down"
    when [1, 0]
      "#{number} goes up"
    when [0, -1]
      "#{number} goes right"
    when [0, 1]
      "#{number} goes left"
    else
      'NO IDEA'
    end
  end
end

class Solver
  def self.a_star(start, goal = (1..9).to_a)
    start_node = PuzzleNode.new(start, goal: goal)
    start_node.g = 0
    start_node.f = start_node.heuristic

    nodes = {}
    nodes[start] = start_node

    open_set = PriorityQueue.new
    open_set.insert(start_node)

    until open_set.empty?
      current = open_set.delete
      if current.state == goal
        path = []
        node = current
        while node
          path << node
          node = node.parent
        end
        return path.reverse
      end

      current.neighbors.each do |neighbor|
        neighbor_node = nodes[neighbor] ||= PuzzleNode.new(neighbor, goal: goal)
        tentative_g = current.g + 1
        if tentative_g < neighbor_node.g
          neighbor_node.parent = current
          neighbor_node.g = tentative_g
          neighbor_node.f = tentative_g + neighbor_node.heuristic
          open_set.insert(neighbor_node) if !open_set.find(neighbor_node)
        end
      end
    end

    return false
  end
end
