ko.bindingHandlers["tap"] = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var t = new Tap(element);
            var newValueAccessor = function () {
                return {'tap':valueAccessor()};
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
        }
}