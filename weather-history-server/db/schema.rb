# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_02_26_114225) do
  create_table "weather_entries", force: :cascade do |t|
    t.string "latitude"
    t.string "longitude"
    t.string "date"
    t.string "max_temp"
    t.string "min_temp"
    t.string "precipitation"
    t.string "wind_speed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["latitude", "longitude", "date"], name: "index_weather_entries_on_latitude_and_longitude_and_date", unique: true
  end

end
