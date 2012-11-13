//
// Time Selector View
//

define([
	'lib/text!../partials/timeselector.html'
	], function (Template) {
	
	return Em.View.extend({
		template: Em.Handlebars.compile(Template),
		setTime: function (event) {

			var timeRange = $(event.target).html();

			C.setTimeRange({
				'Last 24 Hours': 86400,
				'Last 1 Hour': 3600,
				'Last 10 Minutes': 600,
				'Last 1 Minute': 60,
			}[timeRange]);

			var element = $(this.get('element'));

			element.find('img').show();
			element.find('button').hide();

			setTimeout(function () {

				element.find('img').hide();
				element.find('button').show();

			}, 1000);

		}
	});
});