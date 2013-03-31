function ApplicationViewModel() {
  var self = this;

  this.mode = ko.observable("settings");

  this.inLogInMode = ko.dependentObservable(function () {
    return this.mode() == "login";
  }, this);

  this.inScanMode = ko.dependentObservable(function () {
    return this.mode() == "scan";
  }, this);

  this.inSettingsMode = ko.dependentObservable(function () {
    return this.mode() == "settings";
  }, this);

  this.inStatsMode = ko.dependentObservable(function () {
    return this.mode() == "stats";
  }, this);

  this.setLogInMode = function() {
    this.mode("login");
  }

  this.setScanMode = function() {
    if (this.logInViewModel() == null || this.logInViewModel().selectedEvent() == null) {
      return false;
    }
    this.mode("scan");
  }

  this.setSettingsMode = function() {
    this.mode("settings");
  }

  this.setStatsMode = function() {
    if (this.logInViewModel() == null || this.logInViewModel().selectedEvent() == null) {
      return false;
    }
    this.mode("stats");
  }

	this.logInViewModel = ko.observable();

  this.loadLogIn = function(viewModel) {
    this.logInViewModel(viewModel);
  }

  this.scanViewModel = ko.observable();

  this.loadScan = function(viewModel) {
    this.scanViewModel(viewModel);
  }


  this.isLoggedIn = ko.dependentObservable(function () {
    return this.logInViewModel() != null && this.logInViewModel().isLoggedIn();
  }, this);
}