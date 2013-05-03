function MockScannerViewModel() {
  var self = this;

  this.displayRequestQRCodeDialog = ko.observable(false);

  this.scanText = ko.observable();

  this.successCallback = null;

  this.errorCallback = null;


  this.scan = function(successCallback, errorCallback) {
    self.successCallback = successCallback;
    self.errorCallback = errorCallback;
    self.displayRequestQRCodeDialog(true);
  }

  this.completeScan = function() {
    self.displayRequestQRCodeDialog(false);
    result = {
      cancelled: false,
      text: self.scanText()
    };
    self.successCallback(result);
  }

  this.cancelScan = function() {
    self.displayRequestQRCodeDialog(false);
    result = {
      cancelled: true
    };
    self.successCallback(result);
  }
}



