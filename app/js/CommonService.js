(function ($) {
    'use strict';
    angular.module('cService', []);
    angular.module('cService').factory('CommonService', CommonService);
    CommonService.$inject = ['$http', '$q'];
    function CommonService($http, $q) {
        var commonService = {
            getRequest: getRequest,
            getRequestCustom: getRequestCustom,
            postRequest: postRequest,
            postJsonRequest: postJsonRequest,
            postRequestUrlencoded: postRequestUrlencoded
        };

        return commonService;

        function getRequest(requestUrl, params, canceller) {
            var deferred = $.Deferred(),
                cancelTimeout = canceller || $q.defer();

            $http.get(requestUrl + (params !== undefined ? '?' + $.param(params) : ''), { timeout: cancelTimeout.promise }).then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise();
        }

        function getRequestCustom(requestUrl, params, canceller) {
            var deferred = $.Deferred(),
                cancelTimeout = canceller || $q.defer();
            var paramsget = params !== undefined ? '/' + $.param(params).replace('&', '/') : '';
            $http.get(requestUrl + paramsget, { timeout: cancelTimeout.promise }).then(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise();
        }

        function postRequest(requestUrl, params) {
            var deferred = $.Deferred();
            $http.post(requestUrl, JSON.stringify(params)).then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise();
        }

        function postRequestUrlencoded(requestUrl, postData) {
            var deferred = $.Deferred();
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            $http.post(requestUrl, postData).then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise();
        }

        function postJsonRequest(requestUrl, params) {
            var deferred = $.Deferred();
            $http.post(requestUrl, params, { headers: { 'Content-Type': 'application/json;charset=utf-8' } }).then(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.resolve(err);
            });
            return deferred.promise();
        }
    }
})($);









