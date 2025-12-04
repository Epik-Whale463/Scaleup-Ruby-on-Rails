class CreateBookings < ActiveRecord::Migration[7.1]
  def change
    create_table :bookings do |t|
      t.references :mentor, null: false, foreign_key: true
      t.string :student_email
      t.datetime :start_time

      t.timestamps
    end
  end
end
