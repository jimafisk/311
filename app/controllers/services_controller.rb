class ServicesController < ApplicationController
  def index
    @service_requests = Open311.service_list
  end

  def show
    @service_request = Open311.service_definition(params[:id])
  end

  def search
    swiftype = Swiftype::Client.new
    hs_bonus = Highscore::Bonuslist.load_file(Rails.root.join('lib', 'highscore', 'bonuslist.txt'))

    query = params[:query]

    content = Highscore::Content.new query, hs_bonus

    keywords = content.keywords.top(4).join ' '

    results = swiftype.search(ENV['SWIFTYPE_ENGINE'], keywords, {
      :per_page => '5'
    })

    @requests = results.records['servicerequests']

    render :json => @requests.to_json
  end
end
