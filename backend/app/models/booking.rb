class Booking < ApplicationRecord
  belongs_to :mentor
  validates :start_time, presence: true

  # Custom validation to prevent double booking
  validate :no_overlap

  def no_overlap
    if Booking.where(mentor_id: mentor_id, start_time: start_time).exists?
      errors.add(:start_time, "is already booked!")
    end
  end
end
