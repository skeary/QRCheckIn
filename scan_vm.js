function ScanViewModel(settingsVM, qrServer) {
  var self = this;

  this.settingsPageViewModel = settingsVM;
  this.server = qrServer;


  this.scanAndCheckInTicket = function() {
    if (self.server.isMakingRequest()) {
      return;
    }

    var ticketToken = null;

    if (window.plugins != null) {
      window.plugins.barcodeScanner.scan(
        function(result) {
          if (!result.cancelled) {
            ticketToken = result.text;
            self.server.checkInTicket(ticketToken);
          }
        },
        function(error) {
          alert("Scan failed: " + error);
        }
      );
    } else {
      ticketToken = "111111111111111111111111111111111111";
      self.server.checkInTicket(ticketToken);
    }
  }


  this.checkInTicket = function(ticketToken) {
    self.server.checkInTicket(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent(),
      ticketToken
    );
  }

  this.checkOutTicket = function(ticketToken) {
    self.server.passIn(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent(),
      ticketToken
    );
  }


  this.manualCheckin = function() {
    self.server.manualCheckin(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent()
    );
  }

  this.passOut = function() {
    self.server.passOut(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent()
    );
  }

  this.passIn = function() {
    self.server.passIn(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent()
    );
  }
}
