Open311.configure do |config|
  config.endpoint     = ENV['311_ENDPOINT']
  config.api_key      = ENV['311_KEY']
  config.format       = :json
end
