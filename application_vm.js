function ApplicationViewModel() {
  var self = this;

  this.mode = ko.observable("settings");


  this.qrCheckInServices = new QRCheckInServices();
  this.settingsPageViewModel = new SettingsViewModel(this.qrCheckInServices);
  this.scanViewModel = new ScanViewModel(this.settingsPageViewModel, this.qrCheckInServices);
  this.searchPageViewModel = new SearchPageViewModel(this.settingsPageViewModel, this.qrCheckInServices);

  this.inScanMode = ko.dependentObservable(function () {
    return this.mode() == "scan";
  }, this);

  this.inSettingsMode = ko.dependentObservable(function () {
    return this.mode() == "settings";
  }, this);

  this.inSearchMode = ko.dependentObservable(function () {
    return this.mode() == "search";
  }, this);


  this.setSettingsMode = function() {
    if (this.qrCheckInServices.isMakingRequest()) {
      return false;
    }
    this.mode("settings");
  }

  this.setScanMode = function() {
    if (this.settingsPageViewModel.selectedEvent() == null || this.qrCheckInServices.isMakingRequest()) {
      return false;
    }
    this.mode("scan");
  }

  this.setSearchMode = function() {
    if (this.settingsPageViewModel.selectedEvent() == null || this.qrCheckInServices.isMakingRequest()) {
      return false;
    }
    this.mode("search");
  }
}