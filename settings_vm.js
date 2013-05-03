function SettingsViewModel(qrServer, scannerServices) {
  var self = this;

  this.endpoint = ko.observable();
  this.apiKey = ko.observable();
  this.selectedEvent = ko.observable();

  this.hasSelectedEventError = ko.observable(false);

  this.server = qrServer;
  this.scannerServices = scannerServices;



  this.selectedEvent.subscribe(function(newValue) {
      if (newValue != null) {
        self.hasSelectedEventError(false);
      }
  });

  var mapping = {
    'include': ["endpoint", "apiKey"]
  }

  this.clearDetails = function() {
    self.server.isLoggedIn(false);
    self.endpoint(null);
    self.apiKey(null);
    self.selectedEvent(null);
    self.hasSelectedEventError(false);
  }


  this.doLogin = function() {
    localStorage.setItem("qrcheckin.setttings", JSON.stringify(ko.mapping.toJS(self, mapping)));
    self.server.checkEndpoint(self.endpoint(), self.apiKey());
  }

  this.scanLogInSettings = function() {
    self.scannerServices.scan(
      function(result) {
        if (!result.cancelled) {
          var stringifiedObject = result.text;

          if (stringifiedObject != null) {
            var reconstitutedObject = JSON.parse(stringifiedObject);
            self.endpoint(reconstitutedObject.e);
            self.apiKey(reconstitutedObject.a);
          }
        }
      },
      function(error) {
        alert("Scan failed: " + error);
      }
    );
  }

  this.loadSettings = function() {
    var stringifiedObject = localStorage.getItem("qrcheckin.setttings");
    if (stringifiedObject != null) {
      var reconstitutedObject = JSON.parse(stringifiedObject);
      ko.mapping.fromJS(reconstitutedObject, {}, self);

      return true;
    }

    return false;
  }

  this.validateHasEvent = function() {
    if (self.selectedEvent() == null) {
      self.hasSelectedEventError(true);
      return false;
    }
    else {
      self.hasSelectedEventError(false);
      return true;
    }
  }


}