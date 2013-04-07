function ApplicationViewModel() {
  var self = this;

  this.mode = ko.observable("settings");
  this.logInViewModel = new SettingsViewModel();
  this.eventStatistics = new EventStatisticsModel();
  this.scanViewModel = new ScanViewModel(this.logInViewModel, this.eventStatistics);

  this.inLogInMode = ko.dependentObservable(function () {
    return this.mode() == "login";
  }, this);

  this.inScanMode = ko.dependentObservable(function () {
    return this.mode() == "scan";
  }, this);

  this.inSettingsMode = ko.dependentObservable(function () {
    return this.mode() == "settings";
  }, this);

  this.inSearchMode = ko.dependentObservable(function () {
    return this.mode() == "search";
  }, this);


  this.setLogInMode = function() {
    this.mode("login");
  }

  this.setScanMode = function() {
    if (this.logInViewModel == null || this.logInViewModel.selectedEvent() == null) {
      return false;
    }
    this.mode("scan");
  }

  this.setSettingsMode = function() {
    this.mode("settings");
  }

  this.setSearchMode = function() {
    if (this.logInViewModel == null || this.logInViewModel.selectedEvent() == null) {
      return false;
    }
    this.mode("search");
  }
}