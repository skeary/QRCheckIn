require 'sinatra'
require 'json'
require 'rqrcode'
require 'mini_magick'
require './svg.rb'

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
    result[:numberOfCheckIns] = 500

  	result.to_json
  end
end

get '/qr_check_in/:apiKey/:eventName/:ticketToken' do
  content_type :json

  if params[:apiKey] != 'correct_password'
  	{ :success => false }.to_json
  else

    result = {}

    if token == "111111111111111111111111111111111111"
      result[:success] = true
      result[:name] = "Simon Keary"
    else
      result[:success] = false
      result[:errorMessage] = "Could not find ticket in system!!!"
    end

  	result.to_json
  end
end




