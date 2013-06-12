


function ScannerServices(mockScannerVM) {
  var self = this;

  this.mockScannerVM = mockScannerVM;

  this.scan = function(successCallback, errorCallback) {
    if (window.plugins == null || window.plugins.barcodeScanner == null) {
      self.mockScannerVM.scan(successCallback, errorCallback);
    } else {
      window.plugins.barcodeScanner.scan(
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