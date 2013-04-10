function CheckInResultsModel() {
  var self = this;

  this.haveResult = ko.observable(false);

  this.success = ko.observable();

  this.name = ko.observable();

  this.errorMessage = ko.observable();

  this.successMessage = ko.observable();
}


function QRCheckInServices() {
  var self = this;

  this.lastCheckInResultModel = new CheckInResultsModel();
  this.eventStatisticsModel = new EventStatisticsModel();

  this.isMakingRequest = ko.observable(false);
  this.progressMessage = ko.observable();
  this.isLoggedIn = ko.observable(false);
  this.eventList = ko.observableArray();


  this.checkEndpoint = function(endpointUrl, apiKey) {
    self.isLoggedIn(false);
    $.ajax({
      type: 'GET',
      url: endpointUrl + "/qr_check_in/check_endpoint/" + apiKey,
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Error logging in!");
      },
      success: function(event, data, status, xhr) {
        if (event["success"]) {
          self.isLoggedIn(true);

          self.eventList.removeAll();
          for(var i = 0, len=event["eventNames"].length; i < len; i++)
          {
            self.eventList.push(event["eventNames"][i]);
          }
        }
        else {
          alert("Error logging in!");
        }
      }
    });
  }


  this.checkInTicket = function(endpointUrl, apiKey, event, ticketToken) {
    if (self.isMakingRequest()) {
      return;
    }
    if (ticketToken != null) {
      url = endpointUrl + "/qr_check_in/check_in/" + apiKey + "/" + event + "/" + encodeURIComponent(ticketToken);
      self.progressMessage("Checking in Ticket...");
      self.performRemoteEventFunction(url);
    }
  }

  this.checkOutTicket = function(endpointUrl, apiKey, event, ticketToken) {
    if (self.isMakingRequest()) {
      return;
    }
    if (ticketToken != null) {
      url = endpointUrl + "/qr_check_in/check_out/" + apiKey + "/" + event + "/" + encodeURIComponent(ticketToken);
      self.progressMessage("Checking Out Ticket...");
      self.performRemoteEventFunction(url);
    }
  }

  this.manualCheckin = function(endpointUrl, apiKey, event) {
    if (self.isMakingRequest()) {
      return;
    }
    url = endpointUrl + "/qr_check_in/perform_manual_checkin/" + apiKey + "/" + event;
    self.progressMessage("Checking In...");
    self.performRemoteEventFunction(url);
  }

  this.passOut = function(endpointUrl, apiKey, event) {
    if (self.isMakingRequest()) {
      return;
    }
    url = endpointUrl + "/qr_check_in/perform_pass_out/" + apiKey + "/" + event;
    self.progressMessage("Updating Venue Count...");
    self.performRemoteEventFunction(url);
  }

  this.passIn = function(endpointUrl, apiKey, event) {
    if (self.isMakingRequest()) {
      return;
    }
    url = endpointUrl + "/qr_check_in/perform_pass_in/" + apiKey + "/" + event;
    self.progressMessage("Updating Venue Count...");
    self.performRemoteEventFunction(url);
  }


  this.performRemoteEventFunction = function(url) {
    self.lastCheckInResultModel.haveResult(false);
    self.isMakingRequest(true);
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        self.isMakingRequest(false);
        alert("Error contact server");
      },
      success: function(event, data, status, xhr) {

        self.isMakingRequest(false);
        // We now have a result!
        self.lastCheckInResultModel.haveResult(true);

        self.lastCheckInResultModel.success(event["success"]);
        self.lastCheckInResultModel.errorMessage(event["errorMessage"]);
        self.lastCheckInResultModel.successMessage(event["successMessage"]);

        self.eventStatisticsModel.number_of_checkins(event["event_statistics"]["number_of_checkins"]);
        self.eventStatisticsModel.number_in_venue(event["event_statistics"]["number_in_venue"]);
        self.eventStatisticsModel.number_of_failed_checkins(event["event_statistics"]["number_of_failed_checkins"]);
      }
    });
  }
}
