angular.module(PKG.name + '.feature.hydrator')
  .service('PipelineDetailMetricsActionFactory', function(DetailRunsStore, PipelineDetailMetricslDispatcher, MyCDAPDataSource, $filter, MyMetricsQueryHelper) {

    var dispatcher = PipelineDetailMetricslDispatcher.getDispatcher();
    var metricsPollId;
    // FIXME: This is a memory leak. We need to fix this.
    var dataSrc = new MyCDAPDataSource();
    var filter = $filter('filter');
    this.pollForMetrics = function(params) {
      this.stopPoll();
      doPollMetrics(params);
    };

    function doPollMetrics(params) {
      var metricParams = params;
      metricParams = MyMetricsQueryHelper.tagsToParams(metricParams);
      var metricBasePath = '/metrics/search?target=metric&' + metricParams;

      metricsPollId = dataSrc.poll({
        method: 'POST',
        _cdapPath: metricBasePath
      }, function (res) {
        var config = DetailRunsStore.getConfigJson();
        var source = config.source.name;
        var transforms = config.transforms.map(function (n) { return n.name; });
        var sinks = config.sinks.map(function (n) { return n.name; });
        var stagesArray = [source].concat(transforms, sinks);
        stagesArray = stagesArray.map(function (n, i) { return n + '.' + (i+1); });
        var metricQuery = [];

        if (res.length > 0) {
          angular.forEach(stagesArray, function (node) {
            metricQuery = metricQuery.concat(filter(res, node));
          });

          if (metricQuery.length === 0) { return; }

          dataSrc.request({
            method: 'POST',
            _cdapPath: '/metrics/query?' + metricParams + '&metric=' + metricQuery.join('&metric=')
          })
            .then(function(metrics) {
              dispatcher.dispatch('onMetricsFetch', metrics);
            });
        }
      });

      metricsPollId = metricsPollId.__pollId__;
    }

    this.stopPoll = function() {
      if (metricsPollId) {
        dataSrc.stopPoll(metricsPollId);
      }
    };

  });
