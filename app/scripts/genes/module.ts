module ngApp.genes {
  "use strict";

  import IGDCConfig = ngApp.IGDCConfig;
  /* ngInject */
  function genesConfig(
    $stateProvider: ng.ui.IStateProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider,
    config: IGDCConfig
  ) {
    $stateProvider.state("gene", {
      url: "/genes/:geneId",
      controller: "GeneController as gc",
      templateUrl: "genes/templates/gene.html",
      resolve: {
        gene: ($stateParams: ng.ui.IStateParamsService, $http: ng.IHttpService): Object => {
          const hit = $http({
            method: 'POST',
            url: `${config.es_host}/${config.es_index_version}-gene-centric/gene-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "query": {
                "term": {
                  "gene_id": {
                    "value": $stateParams.geneId
                  }
                }
              }
            }
          }).then(data => {
            const gene = data.data.hits.hits[0]._source || {};
            return $http({
              method: 'POST',
              url: `${config.es_host}/${config.es_index_version}-case-centric/case-centric/_search`,
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
            }).then(
            data2 => (Object.assign(
              gene,
              { allCasesAgg: data2.data.aggregations.project_ids.buckets }
              ))
            );
          }, response => {
            console.log(`error getting gene ${JSON.stringify(response)}`);
          });
          if (!$stateParams.geneId) {
            throw Error('Missing route parameter: geneId. Redirecting to 404 page.');
          }
          return hit;
        }
      }
    });
  }

  angular
      .module("ngApp.genes", [
        "genes.controller",
        "ui.router.state"
      ])
      .config(genesConfig);
}
