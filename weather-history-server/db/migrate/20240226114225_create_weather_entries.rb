class CreateWeatherEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :weather_entries do |t|
      t.string :latitude
      t.string :longitude
      t.string :date
      t.string :max_temp
      t.string :min_temp
      t.string :precipitation
      t.string :wind_speed

      t.timestamps
    end
  end
end
