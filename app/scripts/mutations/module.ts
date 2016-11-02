module ngApp.mutations {

  "use strict";

  import IGDCConfig = ngApp.IGDCConfig;
  /* ngInject */
  function mutationsConfig(
    $stateProvider: ng.ui.IStateProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider,
    config: IGDCConfig
  ) {
    $stateProvider.state("mutation", {
      url: "/mutations/:mutationId",
      controller: "MutationController as mc",
      templateUrl: "mutations/templates/mutation.html",
      resolve: {
        mutation: ($stateParams: ng.ui.IStateParamsService, $http: ng.IHttpService): Object => {
          const hit = $http({
            method: 'POST',
            url: `${config.es_host}/${config.es_index_version}-ssm-centric/ssm-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "query": {
                "term": {
                  "ssm_id": {
                    "value": $stateParams.mutationId
                  }
                }
              }
            }
          }).then(data => {
            return data.data.hits.hits[0]._source || {};
          }, response => {
            console.log(`error getting mutation ${JSON.stringify(response)}`);
          });
          if (!$stateParams.mutationId) {
            throw Error('Missing route parameter: mutationId. Redirecting to 404 page.');
          }
          return hit;
          },
        allCasesAgg: ($stateParams: ng.ui.IStateParamsService, $http: ng.IHttpService): Object => {
          return $http({
              method: 'POST',
              url: `${config.es_host}/${config.es_index_version}-case-centric/_search`,
              headers: {'Content-Type' : 'application/json'},
              data:{
                "size": 0,
                "aggs": {
                  "project_ids": {
                    "terms": {
                      "field": "project.project_id",
                    }
                  }
                }
              }
            }).then(data => data.data.aggregations.project_ids.buckets)
        }
      }
    });
  }

  angular
      .module("ngApp.mutations", [
        "mutations.controller",
        "ui.router.state"
      ])
      .config(mutationsConfig);
}
