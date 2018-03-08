(function () {	'use strict';	angular.module('cService', []);//, 'CommonService'	angular.module('cService').factory('CommonService', CommonService);  CommonService.$inject = ['$http', '$q'];  function CommonService($http, $q) {    var commonService = {      getRequest: getRequest,      getRequestCustom: getRequestCustom,      postRequest: postRequest,      postJsonRequest: postJsonRequest    };    return commonService;    function getRequest(requestUrl, params, canceller) {      var deferred = $.Deferred(),      cancelTimeout = canceller || $q.defer();      $http.get(requestUrl + (params !== undefined ? '?' + $.param(params) : ''), {timeout: cancelTimeout.promise}).then(function (data) {        deferred.resolve(data);      });      return deferred.promise();    }    function getRequestCustom(requestUrl, params, canceller) {      var deferred = $.Deferred(),      cancelTimeout = canceller || $q.defer();      var paramsget = params !== undefined ? '/' + $.param(params).replace('&', '/') : '';      $http.get(requestUrl + paramsget, {timeout: cancelTimeout.promise}).then(function (data) {        deferred.resolve(data);      });      return deferred.promise();    }    function postRequest(requestUrl, params) {      var deferred = $.Deferred();      $http.post(requestUrl, JSON.stringify(params)).then(function (data) {        deferred.resolve(data);      });      return deferred.promise();    }    function postJsonRequest(requestUrl, params) {      var deferred = $.Deferred();      $http.post(requestUrl, params, {headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(function (data) {        deferred.resolve(data);      });      return deferred.promise();    }  }})();