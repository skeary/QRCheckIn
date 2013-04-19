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


  this.eventStatisticsModel = new EventStatisticsModel();

  this.isMakingRequest = ko.observable(false);
  this.progressMessage = ko.observable();
  this.isLoggedIn = ko.observable(false);
  this.eventList = ko.observableArray();


  this.checkEndpoint = function(endpointUrl, apiKey) {
    if (self.isMakingRequest()) {
      return;
    }
    self.isLoggedIn(false);
    self.isMakingRequest(true);
    $.ajax({
      type: 'GET',
      url: endpointUrl + "/qr_check_in/check_endpoint/" + apiKey,
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        self.isMakingRequest(false);
        alert("Error logging in!");
      },
      success: function(event, data, status, xhr) {
        self.isMakingRequest(false);
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


  this.checkInTicket = function(endpointUrl, apiKey, event, ticketToken, lastCheckInResultModel, checkedInObservable) {
    if (self.isMakingRequest()) {
      return;
    }
    if (ticketToken != null) {
      url = endpointUrl + "/qr_check_in/check_in/" + apiKey + "/" + event + "/" + encodeURIComponent(ticketToken);
      self.progressMessage("Checking in Ticket...");
      self.performRemoteEventFunction(
        url,
        lastCheckInResultModel,
        function (isSuccessful) {
          if (isSuccessful) {
            checkedInObservable(true);
          }
        }
      );
    }
  }

  this.checkOutTicket = function(endpointUrl, apiKey, event, ticketToken, lastCheckInResultModel, checkedInObservable) {
    if (self.isMakingRequest()) {
      return;
    }
    if (ticketToken != null) {
      url = endpointUrl + "/qr_check_in/check_out/" + apiKey + "/" + event + "/" + encodeURIComponent(ticketToken);
      self.progressMessage("Checking Out Ticket...");
      self.performRemoteEventFunction(
        url,
        lastCheckInResultModel,
        function (isSuccessful) {
          if (isSuccessful) {
            checkedInObservable(false);
          }
        }
      );
    }
  }

  this.manualCheckin = function(endpointUrl, apiKey, event, lastCheckInResultModel) {
    if (self.isMakingRequest()) {
      return;
    }
    url = endpointUrl + "/qr_check_in/perform_manual_checkin/" + apiKey + "/" + event;
    self.progressMessage("Checking In...");
    self.performRemoteEventFunction(url, lastCheckInResultModel);
  }

  this.passOut = function(endpointUrl, apiKey, event, lastCheckInResultModel) {
    if (self.isMakingRequest()) {
      return;
    }
    url = endpointUrl + "/qr_check_in/perform_pass_out/" + apiKey + "/" + event;
    self.progressMessage("Updating Venue Count...");
    self.performRemoteEventFunction(url, lastCheckInResultModel);
  }

  this.passIn = function(endpointUrl, apiKey, event, lastCheckInResultModel) {
    if (self.isMakingRequest()) {
      return;
    }
    url = endpointUrl + "/qr_check_in/perform_pass_in/" + apiKey + "/" + event;
    self.progressMessage("Updating Venue Count...");
    self.performRemoteEventFunction(url, lastCheckInResultModel);
  }


  this.performRemoteEventFunction = function(url, lastCheckInResultModel, callback) {
    lastCheckInResultModel.haveResult(false);
    self.isMakingRequest(true);
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        self.isMakingRequest(false);
        alert("Error contact server");
        if (callback != null) {
          callback(false);
        }
      },
      success: function(event, data, status, xhr) {

        self.isMakingRequest(false);
        // We now have a result!
        lastCheckInResultModel.haveResult(true);

        lastCheckInResultModel.success(event["success"]);
        lastCheckInResultModel.errorMessage(event["errorMessage"]);
        lastCheckInResultModel.successMessage(event["successMessage"]);

        self.eventStatisticsModel.number_of_checkins(event["event_statistics"]["number_of_checkins"]);
        self.eventStatisticsModel.number_in_venue(event["event_statistics"]["number_in_venue"]);
        self.eventStatisticsModel.number_of_failed_checkins(event["event_statistics"]["number_of_failed_checkins"]);
        if (callback != null) {
          callback(event["success"]);
        }
      }
    });
  }
}
