function ScanViewModel(settingsVM, qrServer, scannerServices) {
  var self = this;

  this.lastCheckInResultModel = new CheckInResultsModel();
  this.settingsPageViewModel = settingsVM;
  this.server = qrServer;
  this.scannerServices = scannerServices;

  this.isScanning = ko.observable(false);


  this.updateStatistics = function() {
    self.server.updateStatistics(
      self.settingsPageViewModel.endpoint(),
      self.settingsPageViewModel.apiKey(),
      self.settingsPageViewModel.selectedEvent(),
      self.lastCheckInResultModel
    );
  }



  this.scanAndCheckInTicket = function(applicationVM) {
    if (self.server.isMakingRequest()) {
      return;
    }

    self.isScanning(true);

    var ticketToken = null;

    self.scannerServices.scan(
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
        alertWrapper("Scan failed: " + error);
      }
    );

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
