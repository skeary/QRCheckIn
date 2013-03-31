function LastCheckInModel() {
  var self = this;

  this.haveResult = ko.observable(false);

  this.success = ko.observable();

  this.name = ko.observable();

  this.errorMessage = ko.observable();
}


function ScanViewModel() {
  var self = this;

  this.logInViewModel = ko.observable();

  this.lastCheckInResultViewModel = ko.observable(new LastCheckInModel());

  this.loadLogIn = function(viewModel) {
    this.logInViewModel(viewModel);
  }

  this.scanAndCheckInTicket = function() {
    alert('got ticket')
    window.plugins.barcodeScanner.scan(
      function(result) {
        if (!result.cancelled) {
          var ticketToken = result.text;

          alert('about to ajax');

          alert(self.logInViewModel().endpoint() + "/qr_check_in/check_in/");

          $.ajax({
            type: 'GET',
            url: self.logInViewModel().endpoint() + "/qr_check_in/check_in/" +
              self.logInViewModel().apiKey() + "/" + 
              self.loginViewModel().selectedEvent() + "/" +
              ticketToken,
            dataType: 'json',
            error: function(xhr, ajaxOptions, thrownError) {
              alert("Error contact server");
            },
            success: function(event, data, status, xhr) {
              // We have a result now!
              self.lastCheckInResultViewModel().haveResult(true);

              self.lastCheckInResultViewModel().success(event["success"]);
              self.lastCheckInResultViewModel().name(event["name"]);
              self.lastCheckInResultViewModel().errorMessage(event["errorMessage"]);
            }
          });

        }
      },
      function(error) {
        alert("Scan failed: " + error);
      }
    );
  }
}