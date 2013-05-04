require 'sinatra/base'
require 'json'
require 'rqrcode'
require 'mini_magick'
require './svg.rb'
require 'erb'



class ApiApp < Sinatra::Base
  # ... app code here ...

  set :number_of_checkins, 0
  set :number_in_venue, 0
  set :number_of_failed_checkins, 0
  set :orders, []


  def initialize()
    super()

    orders = []

    (0..9).each do |idx|
      orders[idx] = {}
      orders[idx][:name] = "John Smith"
      orders[idx][:address] = (idx + 10).to_s + " Smith Street, Perth"
      orders[idx][:tickets] = []
      (0..1).each do |jdx|
        orders[idx][:tickets][jdx] = {}
        # Generate random ticket token
        args = [ Time.now, (1..10).map{ rand.to_s } ]
        orders[idx][:tickets][jdx][:ticketToken] = Digest::SHA256.hexdigest(args.flatten.join('--'))[0..47]
        orders[idx][:tickets][jdx][:checked_in] = false
        orders[idx][:tickets][jdx][:summary] = "Standard Ticket 1/1"
      end
    end

    settings.orders = orders
  end

  get '/' do
    @name = "fred"
    @orders = settings.orders
    erb :index
  end



  get '/get_qr_code/:text' do
    content_type 'image/png'

    size   = 6
    level  = :h
    qrcode = RQRCode::QRCode.new(params[:text], :size => size, :level => level)
    svg = RQRCode::Renderers::SVG::render(qrcode, { :unit => 3 })
    image = MiniMagick::Image.read(svg) { |i| i.format "svg" }
    image.format "png"
    image.to_blob
  end


  get '/get_valid_login' do
    content_type 'image/png'

    login_details = {}
    login_details[:e] = "#{request.scheme}://#{request.host}:#{request.port}"
    login_details[:a] = "correct_password"

    puts login_details.to_json

    size   = 8
    level  = :h
    qrcode = RQRCode::QRCode.new(login_details.to_json, :size => size, :level => level)
    svg = RQRCode::Renderers::SVG::render(qrcode, { :unit => 3 })
    image = MiniMagick::Image.read(svg) { |i| i.format "svg" }
    image.format "png"
    image.to_blob
  end

  get '/qr_check_in/check_endpoint/:apiKey' do
    content_type :json

    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      eventNames = ['event 1', 'event 2', 'event 3']
      { :success => true, :eventNames => eventNames }.to_json
    end
  end

  get '/qr_check_in/get_event_statistics/:apiKey/:eventName' do
    content_type :json

    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else

      result = {}
      result[:success] = true
      result[:event_statistics] = {}
      result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
      result[:event_statistics][:number_in_venue] = settings.number_in_venue
      result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

      result.to_json
    end
  end

  get '/qr_check_in/check_in/:apiKey/:eventName/:ticketToken' do
    content_type :json

    sleep(0.5)
    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      result = {}

      settings.orders.each do |order|
        order[:tickets].each_with_index do |ticket, ticketIndex|
          if ticket[:ticketToken] == params[:ticketToken]
            if !ticket[:checked_in]

              settings.number_of_checkins += 1
              settings.number_in_venue += 1

              result[:success] = true
              result[:success_message] = "Checked In: #{order[:name]} (#{ticketIndex + 1}/#{order[:tickets].count})."
              result[:name] = order[:name]
              result[:event_statistics] = {}
              result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
              result[:event_statistics][:number_in_venue] = settings.number_in_venue
              result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

              ticket[:checked_in] = true
            else
              result[:success] = false
              result[:error_message] = "Ticket already checked in!"
              result[:event_statistics] = {}
              result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
              result[:event_statistics][:number_in_venue] = settings.number_in_venue
              result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins
            end

            return result.to_json
          end
        end
      end

      settings.number_of_failed_checkins += 1

      result[:success] = false
      result[:error_message] = "Could not find ticket in system!"
      result[:event_statistics] = {}
      result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
      result[:event_statistics][:number_in_venue] = settings.number_in_venue
      result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

      result.to_json
    end
  end

  get '/qr_check_in/check_out/:apiKey/:eventName/:ticketToken' do
    content_type :json

    sleep(0.5)
    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      result = {}

      settings.number_of_checkins -= 1
      settings.number_in_venue -= 1

      result[:success] = true
      result[:success_message] = "Checked Out: John Smith (1/1)."
      result[:name] = "John Smith"
      result[:event_statistics] = {}
      result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
      result[:event_statistics][:number_in_venue] = settings.number_in_venue
      result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

      result.to_json
    end
  end




  get '/qr_check_in/perform_manual_checkin/:apiKey/:eventName' do
    content_type :json

    sleep(0.5)
    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      result = {}

      settings.number_of_checkins += 1
      settings.number_in_venue += 1

      result[:success] = true
      result[:success_message] = "Checked In: Door Sale."
      result[:event_statistics] = {}
      result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
      result[:event_statistics][:number_in_venue] = settings.number_in_venue
      result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

      result.to_json
    end
  end


  get '/qr_check_in/perform_pass_out/:apiKey/:eventName' do
    content_type :json

    sleep(0.5)
    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      result = {}

      settings.number_in_venue -= 1

      result[:success] = true
      result[:success_message] = "Decreased Venue Count."
      result[:event_statistics] = {}
      result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
      result[:event_statistics][:number_in_venue] = settings.number_in_venue
      result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

      result.to_json
    end
  end

  get '/qr_check_in/perform_pass_in/:apiKey/:eventName' do
    content_type :json

    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      result = {}

      sleep(10000)

      settings.number_in_venue += 1

      result[:success] = true
      result[:success_message] = "Increased Venue Count."
      result[:event_statistics] = {}
      result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
      result[:event_statistics][:number_in_venue] = settings.number_in_venue
      result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

      result.to_json
    end
  end


  get '/qr_check_in/search/:apiKey/:eventName/:name' do
    content_type :json

    sleep(0.5)
    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      result = {}

      result[:success] = true
      result[:matches] = settings.orders
      result.to_json
    end
  end


  # start the server if ruby file executed directly
  run! if app_file == $0
end













