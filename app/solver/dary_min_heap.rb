module DaryMinHeap
  def self.[](d)
    # TODO: raise exception if d < 2
    @@D = d
    self
  end

  def insert(value)
    heap << value
    bubble_up(heap.size - 1)
  end

  def delete
    last = heap.pop
    return last if heap.empty?
    min, heap[0] = heap[0], last
    bubble_down(0)
    min
  end

  def find(value, index = 0)
    return false unless index < size && value >= heap[index]
    return heap[index] if heap[index] == value
    children(index).each do |c|
      found = find(value, c)
      return found if found
    end
    false
  end

  def size
    heap.size
  end

  def empty?
    heap.size.zero?
  end

  private

  def heap
    @heap ||= []
  end

  def bubble_up(index)
    while index > 0 && heap[parent(index)] > heap[index]
      heap[index], heap[parent(index)] = heap[parent(index)], heap[index]
      index = parent(index)
    end
  end

  def bubble_down(index)
    children(index).each do |c|
      if heap[index] > heap[c]
        heap[index], heap[c] = heap[c], heap[index]
        bubble_down(c)
      end
    end
  end

  def parent(index)
    return nil if index < 1
    (index - 1) / @@D
  end

  def children(index)
    (1..@@D).map { |c| index * @@D + c }.reject { |c| c >= heap.size }
  end
end
