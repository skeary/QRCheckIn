function SettingsViewModel(qrServer) {
  var self = this;

  this.endpoint = ko.observable();
  this.apiKey = ko.observable();
  this.selectedEvent = ko.observable();

  this.server = qrServer;

  var mapping = {
    'include': ["endpoint", "apiKey"]
  }

  this.doLogin = function() {
    localStorage.setItem("qrcheckin.setttings", JSON.stringify(ko.mapping.toJS(self, mapping)));
    self.server.checkEndpoint(self.endpoint(), self.apiKey());
  }

  this.scanLogInSettings = function() {
    window.plugins.barcodeScanner.scan(
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
}