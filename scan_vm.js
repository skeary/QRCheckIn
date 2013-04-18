function ScanViewModel(settingsVM, qrServer) {
  var self = this;

  this.lastCheckInResultModel = new CheckInResultsModel();
  this.settingsPageViewModel = settingsVM;
  this.server = qrServer;

  this.isScanning = ko.observable(false);


  this.scanAndCheckInTicket = function() {
    if (self.server.isMakingRequest()) {
      return;
    }

    self.isScanning(true);

    alert('here');

    var ticketToken = null;

    if (window.plugins != null) {
      window.plugins.barcodeScanner.scan(
        function(result) {
          if (!result.cancelled) {
            ticketToken = result.text;
            self.server.checkInTicket(
              self.settingsPageViewModel.endpoint(),
              self.settingsPageViewModel.apiKey(),
              self.settingsPageViewModel.selectedEvent(),
              ticketToken,
              self.lastCheckInResultModel
            );
          }
        },
        function(error) {
          alert("Scan failed: " + error);
        }
      );
    } else {
      ticketToken = "111111111111111111111111111111111111";
      self.server.checkInTicket(
        self.settingsPageViewModel.endpoint(),
        self.settingsPageViewModel.apiKey(),
        self.settingsPageViewModel.selectedEvent(),
        ticketToken,
        self.lastCheckInResultModel
      );
    }

    self.isScanning(false);    
  }


  this.manualCheckin = function() {
    self.server.manualCheckin(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent(),
      self.lastCheckInResultModel
    );
  }

  this.passOut = function() {
    self.server.passOut(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent(),
      self.lastCheckInResultModel
    );
  }

  this.passIn = function() {
    self.server.passIn(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent(),
      self.lastCheckInResultModel
    );
  }
}
