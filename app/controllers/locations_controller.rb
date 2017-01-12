class LocationsController < ApplicationController
  def index
  end

  def search
    require 'net/http'
    uri = URI('http://map01.cityofboston.gov/samapi/Api/search?q=' + params[:query])
    req = Net::HTTP.get(uri)
    req = JSON.parse req

    @locations = req['addressResults']

    respond_to do |format|
      format.html
      format.json { render json: @locations }
    end
  end
end
