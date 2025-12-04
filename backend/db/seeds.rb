# Clear existing
Booking.delete_all
Mentor.delete_all

# Create Mentors
mentors = Mentor.create!([
  { name: "Alice (Python Expert)" },
  { name: "Bob (System Design Guru)" },
  { name: "Charlie (React Wizard)" }
])

puts "Seeded #{Mentor.count} mentors."
