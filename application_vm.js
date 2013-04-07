function ApplicationViewModel() {
  var self = this;

  this.mode = ko.observable("settings");
  this.settingsPageViewModel = new SettingsViewModel();
  this.scanViewModel = new ScanViewModel(this.settingsPageViewModel);
  this.searchPageViewModel = new SearchPageViewModel(this.settingsPageViewModel);

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
    if (this.scanViewModel.isSearchingForTicket()) {
      return false;
    }
    this.mode("settings");
  }

  this.setScanMode = function() {
    if (this.settingsPageViewModel.selectedEvent() == null || this.scanViewModel.isSearchingForTicket()) {
      return false;
    }
    this.mode("scan");
  }



  this.setSearchMode = function() {
    if (this.settingsPageViewModel.selectedEvent() == null || this.scanViewModel.isSearchingForTicket()) {
      return false;
    }
    this.mode("search");
  }
}