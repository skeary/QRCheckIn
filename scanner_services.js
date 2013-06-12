


function ScannerServices(mockScannerVM) {
  var self = this;

  this.mockScannerVM = mockScannerVM;

  this.scan = function(successCallback, errorCallback) {
    if (cordova == null || window.plugins == null || window.plugins.barcodeScanner == null) {
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