include Rails.application.routes.url_helpers

namespace :index do
  task :service_requests => :environment do
    swiftype = Swiftype::Client.new

    @requests = Open311.service_list

    @requests.each do |request|
      begin
        request.metadata = Open311.service_definition(request.service_code)

        fields = [
          {:name => 'title', :value => request.service_name, :type => 'string'},
          {:name => 'service_code', :value => request.service_code, :type => 'string'},
          {:name => 'keywords', :value => request.keywords, :type => 'string'},
          {:name => 'url', :value => service_url(request.service_code), :type => 'string'},
          {:name => 'description', :value => request.description, :type => 'string'}
        ]

        puts request.keywords

        request.metadata.attributes.each do |attribute|
          unless attribute.datatype_description.nil?
            fields.push({:name => 'metadata[' + attribute.code + ']_datatype_description', :value => attribute.datatype_description, :type => 'string'})
          end

          unless attribute.description.nil?
            fields.push({:name => 'metadata[' + attribute.code + ']_description', :value => attribute.description, :type => 'string'})
          end
        end

        document = swiftype.create_or_update_document(ENV['SWIFTYPE_ENGINE'], ENV['SWIFTYPE_DOCTYPE'], {
          :external_id => request.service_code,
          :fields => fields
        })


      rescue => error
        puts error.inspect
      end
    end
  end
end
