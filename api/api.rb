require 'sinatra/base'
require 'json'
require 'rqrcode'
require 'mini_magick'
require './svg.rb'



class ApiApp < Sinatra::Base
  # ... app code here ...

  set :number_of_checkins, 0
  set :number_in_venue, 0
  set :number_of_failed_checkins, 0

  get '/get_valid_login' do
    content_type 'image/png'

    login_details = {}
    login_details[:e] = "#{request.scheme}://#{request.host}:#{request.port}"
    login_details[:a] = "correct_password"

    size   = 6
    level  = :h
    qrcode = RQRCode::QRCode.new(login_details.to_json, :size => size, :level => level)
    svg = RQRCode::Renderers::SVG::render(qrcode, { :unit => 7 })
    image = MiniMagick::Image.read(svg) { |i| i.format "svg" }
    image.format "png"
    image.to_blob
  end

  get '/qr_check_in/check_endpoint/:apiKey' do
    content_type :json

    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      { :success => true }.to_json
    end
  end

  get '/qr_check_in/get_event_list/:apiKey' do
    content_type :json

    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      eventNames = ['event 1', 'event 2', 'event 3']

      result = {}
      result[:success] = true
      result[:eventNames] = eventNames

      result.to_json
    end
  end

  get '/qr_check_in/get_event_statistics/:eventName/:apiKey' do
    content_type :json

    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else

      result = {}
      result[:number_of_checkins] = settings.number_of_checkins
      result[:number_in_venue] = settings.number_in_venue
      result[:number_of_failed_checkins] = settings.number_of_failed_checkins

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

      if params[:ticketToken] == "111111111111111111111111111111111111"

        settings.number_of_checkins += 1
        settings.number_in_venue += 1

        result[:success] = true
        result[:successMessage] = "Checked In: John Smith."
        result[:name] = "John Smith"
        result[:event_statistics] = {}
        result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
        result[:event_statistics][:number_in_venue] = settings.number_in_venue
        result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins
      else

        settings.number_of_failed_checkins += 1

        result[:success] = false
        result[:errorMessage] = "Could not find ticket in system!"
        result[:event_statistics] = {}
        result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
        result[:event_statistics][:number_in_venue] = settings.number_in_venue
        result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins
      end

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
      result[:successMessage] = "Checked In: Door Sale."
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
      result[:successMessage] = "Decreased Venue Count."
      result[:event_statistics] = {}
      result[:event_statistics][:number_of_checkins] = settings.number_of_checkins
      result[:event_statistics][:number_in_venue] = settings.number_in_venue
      result[:event_statistics][:number_of_failed_checkins] = settings.number_of_failed_checkins

      result.to_json
    end
  end

  get '/qr_check_in/perform_pass_in/:apiKey/:eventName' do
    content_type :json

    sleep(5)
    if params[:apiKey] != 'correct_password'
      { :success => false }.to_json
    else
      result = {}

      settings.number_in_venue += 1

      result[:success] = true
      result[:successMessage] = "Increased Venue Count."
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
      result[:matches] = []

      (0..9).each do |idx|
        result[:matches][idx] = {}
        result[:matches][idx][:name] = "John Smith"
        result[:matches][idx][:address] = (idx + 10).to_s + " Smith Street, Perth"
        result[:matches][idx][:tickets] = []
        (0..1).each do |jdx|
          result[:matches][idx][:tickets][jdx] = {}
          result[:matches][idx][:tickets][jdx][:ticketToken] = "jhfgajhsdj:" + idx.to_s + ":" + jdx.to_s
          result[:matches][idx][:tickets][jdx][:checked_in] = jdx == 0
        end
      end
      result.to_json
    end
  end


  # start the server if ruby file executed directly
  run! if app_file == $0
end













