class ServicesController < ApplicationController
  def index
    @service_requests = Open311.service_list
  end

  def show
    @service_request = Open311.service_definition(params[:id])
  end
end
