function SettingsViewModel() {
  var self = this;
  this.endpoint = ko.observable();
  this.apiKey = ko.observable();
  this.eventList = ko.observableArray();
  this.selectedEvent = ko.observable();

  this.isLoggedIn = ko.observable(false);

  var mapping = {
    'include': ["endpoint", "apiKey"]
  }

  this.doLogin = function() {
    self.isLoggedIn(false);
    localStorage.setItem("qrcheckin.setttings", JSON.stringify(ko.mapping.toJS(self, mapping)));
    $.ajax({
      type: 'GET',
      url: self.endpoint() + "/qr_check_in/check_endpoint/" + self.apiKey(),
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Error logging in!");
      },
      success: function(event, data, status, xhr) {
        if (event["success"]) {
          $(document).scrollTop(0);
          self.isLoggedIn(true);
          self.populateEventList();
        }
        else {
          alert("Error logging in!");
        }
      }
    });
  }

  this.populateEventList = function() {
    $.ajax({
      type: 'GET',
      url: self.endpoint() + "/qr_check_in/get_event_list/" + self.apiKey(),
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Error logging in!");
      },
      success: function(event, data, status, xhr) {
        if (event["success"]) {
          self.eventList(event["eventNames"]);
        }
      }
    });
  }

  this.scanLogInSettings = function() {
    alert('About to scan...');
    window.plugins.barcodeScanner.scan(
      function(result) {
        if (!result.cancelled) {
          alert('done with scanning');
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