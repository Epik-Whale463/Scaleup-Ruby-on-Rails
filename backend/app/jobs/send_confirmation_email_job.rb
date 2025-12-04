class SendConfirmationEmailJob < ApplicationJob
  queue_as :default

  def perform(booking_id)
    booking = Booking.find(booking_id)
    # Simulate email sending
    sleep 5
    puts "Email sent to #{booking.student_email} for booking with #{booking.mentor.name} at #{booking.start_time}"
  end
end
