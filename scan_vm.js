function LastCheckInModel() {
  var self = this;

  this.haveResult = ko.observable(false);

  this.success = ko.observable();

  this.name = ko.observable();

  this.errorMessage = ko.observable();
}


function ScanViewModel(logInVM, eventStatisticsVM) {
  var self = this;

  this.logInViewModel = logInVM;
  this.eventStatisticsViewModel = eventStatisticsVM;
  this.lastCheckInResultViewModel = new LastCheckInModel();

  this.isSearchingForTicket = ko.observable(false);
  this.progressMessage = ko.observable();


  this.scanAndCheckInTicket = function() {
    self.lastCheckInResultViewModel.haveResult(false);

    var ticketToken = null;

    if (window.plugins != null) {
      window.plugins.barcodeScanner.scan(
        function(result) {
          if (!result.cancelled) {
            ticketToken = result.text;
            self.searchForTicket(ticketToken);
          }
        },
        function(error) {
          alert("Scan failed: " + error);
        }
      );
    } else {
      ticketToken = "111111111111111111111111111111111111";
      self.searchForTicket(ticketToken);
    }
  }


  this.searchForTicket = function(ticketToken) {
    if (ticketToken != null) {
      url = self.logInViewModel.endpoint() + "/qr_check_in/check_in/" + 
        self.logInViewModel.apiKey() + "/" + 
        self.logInViewModel.selectedEvent() + "/" + encodeURIComponent(ticketToken);

      self.progressMessage("Searching for ticket...");
      self.performRemoteEventFunction(url);
    }
  }

  this.manualCheckin = function() {
    url = self.logInViewModel.endpoint() + "/qr_check_in/perform_manual_checkin/" + 
      self.logInViewModel.apiKey() + "/" + 
      self.logInViewModel.selectedEvent();

    self.progressMessage("Checking In...");
    self.performRemoteEventFunction(url);
  }

  this.passOut = function() {
    url = self.logInViewModel.endpoint() + "/qr_check_in/perform_pass_out/" + 
      self.logInViewModel.apiKey() + "/" + 
      self.logInViewModel.selectedEvent();

    self.progressMessage("Updating Venue Count...");
    self.performRemoteEventFunction(url);
  }

  this.passIn = function() {
    url = self.logInViewModel.endpoint() + "/qr_check_in/perform_pass_in/" + 
      self.logInViewModel.apiKey() + "/" + 
      self.logInViewModel.selectedEvent();

    self.progressMessage("Updating Venue Count...");
    self.performRemoteEventFunction(url);
  }


  this.performRemoteEventFunction = function(url) {
    self.lastCheckInResultViewModel.haveResult(false);
    self.isSearchingForTicket(true);
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        self.isSearchingForTicket(false);
        alert("Error contact server");
      },
      success: function(event, data, status, xhr) {

        self.isSearchingForTicket(false);
        // We now have a result!
        self.lastCheckInResultViewModel.haveResult(true);

        self.lastCheckInResultViewModel.success(event["success"]);
        self.lastCheckInResultViewModel.errorMessage(event["errorMessage"]);

        self.eventStatisticsViewModel.number_of_checkins(event["event_statistics"]["number_of_checkins"]);
        self.eventStatisticsViewModel.number_in_venue(event["event_statistics"]["number_in_venue"]);
        self.eventStatisticsViewModel.number_of_failed_checkins(event["event_statistics"]["number_of_failed_checkins"]);
      }
    });
  }
}
