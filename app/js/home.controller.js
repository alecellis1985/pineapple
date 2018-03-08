(function () {
  'use strict';
  //debugger;
  angular.module('form').controller('homeCtrl', homeCtrl);
  homeCtrl.$inject = ['$timeout', '$rootScope', 'CommonService'];
    function homeCtrl($timeout, $rootScope, CommonService) {
        var vm = this;

		vm.sendEmail = function (isValid) {
            if (!isValid) {
                $rootScope.$broadcast('alert-event', { type: 'danger', msg: "Existen errores en el formulario!" });
                return;
            }

			CommonService.postJsonRequest('api/sendMail', vm.user).then(function (result) {
                if (result.data.success)
                    $rootScope.$broadcast('alert-event', { type: 'success', msg: 'Has sido registrado con exito' });
                else
                    $rootScope.$broadcast('alert-event', { type: 'danger', msg: result.data.msg });
            });
        };

        init();
        //Functions *

        function init() {
        }
    }
})();