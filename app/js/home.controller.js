(function (angular) {
    'use strict';
    //debugger;
    angular.module('form').controller('homeCtrl', homeCtrl);
    homeCtrl.$inject = ['$rootScope', 'CommonService'];
    function homeCtrl($rootScope, CommonService) {
        var vm = this;
        vm.submitted = true;
        vm.sent = false;
        vm.showErr = false;
        vm.showSuccess = false;
        vm.sendEmail = function (isValid) {
            if (!isValid) {
                vm.showErr = true;
                return;
            }
            debugger;

            CommonService.postJsonRequest('api/sendMail', vm.user).then(function (result) {
                if (result.status !== 200) {
                    vm.showErr = true;
                    vm.errMessage = "Form is not valid.";
                    return;
                }
                if (result.data.success) {
                    vm.sent = true;
                    vm.showErr = false;
                    vm.showSuccess = true;
                    vm.succcessMessage = "Email has been sent! We'll get back to you soon!";
                }
                else {
                    vm.showErr = true;
                    vm.errMessage = result.data.msg;
                }
            });
        };

        init();

        function init() {
        }
    }
})(angular);