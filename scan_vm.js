function LastCheckInModel() {
  var self = this;

  this.haveResult = ko.observable(false);

  this.success = ko.observable();

  this.name = ko.observable();

  this.errorMessage = ko.observable();
}


function ScanViewModel() {
  var self = this;

  this.logInViewModel = ko.observable();

  this.lastCheckInResultViewModel = ko.observable(new LastCheckInModel());

  this.isSearchingForTicket = ko.observable(false);

  this.loadLogIn = function(viewModel) {
    this.logInViewModel(viewModel);
  }

  this.scanAndCheckInTicket = function() {
    self.lastCheckInResultViewModel().haveResult(false);

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
      self.isSearchingForTicket(true);
      $.ajax({
        type: 'GET',
        url: self.logInViewModel().endpoint() + "/qr_check_in/check_in/" + 
          self.logInViewModel().apiKey() + "/" + 
          self.logInViewModel().selectedEvent() + "/" + encodeURIComponent(ticketToken),
        dataType: 'json',
        error: function(xhr, ajaxOptions, thrownError) {
          self.isSearchingForTicket(false);
          alert("Error contact server");
        },
        success: function(event, data, status, xhr) {

          self.isSearchingForTicket(false);
          // We now have a result!
          self.lastCheckInResultViewModel().haveResult(true);

          self.lastCheckInResultViewModel().success(event["success"]);
          self.lastCheckInResultViewModel().name(event["name"]);
          self.lastCheckInResultViewModel().errorMessage(event["errorMessage"]);
        }
      });
    }
  }
}

