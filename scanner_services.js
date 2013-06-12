


function ScannerServices(mockScannerVM) {
  var self = this;

  this.mockScannerVM = mockScannerVM;

  this.scan = function(successCallback, errorCallback) {
    if (false) {
      self.mockScannerVM.scan(successCallback, errorCallback);
    } else {
      var scanner = cordova.require("cordova/plugin/BarcodeScanner");
      scanner.scan(
        function(result) {
          successCallback(result);
        },
        function(error) {
          errorCallback(error);
        }
      );
    }
  }
}