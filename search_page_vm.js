


function MatchViewModel(data) {
  var self = this;
  this.isExpanded = ko.observable(false);

  this.expand = function() {
    self.isExpanded(true);
  }

  this.collapse = function() {
    self.isExpanded(false);
  }

  ko.mapping.fromJS(data, {}, this);
}



function SearchPageViewModel(settingsVM) {
  var self = this;

  this.name = ko.observable();
  this.results = ko.observable();
  this.settingsPageViewModel = settingsVM;

  this.resultsMapping = {
    'matches': {
      create: function(options) {
          return new MatchViewModel(options.data);
      }
    }
  }

  this.searchForName = function(name) {

	  url = self.settingsPageViewModel.endpoint() + "/qr_check_in/search/" + 
	    self.settingsPageViewModel.apiKey() + "/" + 
	    encodeURIComponent(self.settingsPageViewModel.selectedEvent()) + "/" + encodeURIComponent(self.name());

    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Error contact server");
      },
      success: function(event, data, status, xhr) {
        self.results(ko.mapping.fromJS(event, self.resultsMapping));
      }
    });
  }
}
