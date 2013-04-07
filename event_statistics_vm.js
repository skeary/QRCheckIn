function EventStatisticsModel() {
  var self = this;

  this.number_of_checkins = ko.observable(0);
  this.number_in_venue = ko.observable(0);
  this.number_of_failed_checkins = ko.observable(0);
}