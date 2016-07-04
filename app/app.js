import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-google-chart';
import 'angular-moment';
import 'angular-ui-bootstrap';

import { app } from './components/app';
import { beanMetric } from './components/bean-metric';
import { nodeMetric } from './components/node-metric';
import { searchField } from './components/search-field';
import { dashboard } from './components/dashboard';
import { menubar } from './components/menubar';
import { nodelist } from './components/nodelist';
import { reportList } from './components/report-list';
import { importantFacts } from './components/important-facts';

import { NodeDetailCtrl } from './controllers/nodedetail/nodedetail';
import { FactsCtrl } from './controllers/facts/facts';
import { EventsCtrl } from './controllers/events/events';

import { Config } from './services/config';
import { PuppetDB } from './services/puppetdb';

angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'googlechart',
  'angularMoment',
  'ui.bootstrap',
])
  .component('app', app)
  .component('beanMetric', beanMetric)
  .component('nodeMetric', nodeMetric)
  .component('searchField', searchField)
  .component('dashboard', dashboard)
  .component('menubar', menubar)
  .component('nodelist', nodelist)
  .component('reportList', reportList)
  .component('importantFacts', importantFacts)
  .controller('NodeDetailCtrl', NodeDetailCtrl)
  .controller('FactsCtrl', FactsCtrl)
  .controller('EventsCtrl', EventsCtrl)
  .service('config', Config)
  .service('puppetDB', PuppetDB)
  .run(($rootScope, $location, $http, puppetDB) => {
    // Make the $location service available in root scope
    $rootScope.location = $location;
    $rootScope.isLoading = () => $http.pendingRequests.length !== 0;
    $rootScope.clearError = () => { $rootScope.error = null; };
    $rootScope.$on('queryChange', $rootScope.clearError);
    $rootScope.$on('queryChange', puppetDB.cancel);
    $rootScope.$on('filterChange', puppetDB.cancel);
    $rootScope.changePage = (page) => {
      $location.search('page', page);
      $rootScope.$broadcast('pageChange', { page });
    };
  });

angular.module('app').factory('$exceptionHandler', ($injector, $log) =>
  (exception, cause) => {
    $log.error(exception, cause);
    if (!cause) {
      const $rootScope = $injector.get('$rootScope');
      $rootScope.error = exception.message;
    }
  }
);

angular.module('app').config(($routeProvider) =>
  $routeProvider.when('/dashboard', {
    template: '<dashboard></dashboard>',
    reloadOnSearch: false,
  })
  .when('/nodes', {
    template: '<nodelist query="$ctrl.query"></nodelist>',
    reloadOnSearch: false,
  })
  .when('/node/:node', {
    templateUrl: 'controllers/nodedetail/nodedetail.tpl.html',
    controller: 'NodeDetailCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  })
  .when('/events', {
    templateUrl: 'controllers/events/events.tpl.html',
    controller: 'EventsCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  })
  .when('/facts', {
    templateUrl: 'controllers/facts/facts.tpl.html',
    controller: 'FactsCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  })
  .otherwise({ redirectTo: '/dashboard' })
);
