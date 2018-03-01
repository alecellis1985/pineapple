(function () {
  'use strict';
  //debugger;
  angular.module('form').controller('homeCtrl', homeCtrl);
  homeCtrl.$inject = ['$timeout', '$rootScope', 'CommonService'];
  function homeCtrl($timeout, $rootScope, CommonService) {
    var vm = this;
    vm.user = {};

    vm.sendEmail = function (isValid) {
      if (!isValid) {
        //$rootScope.$broadcast('alert-event', {type: 'danger', msg: "Existen errores en el formulario, por favor complete correctamente todos los campos;"});
        return;
      }
      CommonService.postJsonRequest('api/sendMail', vm.user).then(function (result) {
        //if (result.data.success) {
        //    $rootScope.$broadcast('alert-event', {type: 'success', msg: 'Muchas gracias por su contacto. Nos estaremos comunicando a la brevedad'});
        //} else {
        //  //$rootScope.$broadcast('alert-event', {type: 'danger', msg: result.data.msg});
        //  alert('Error al enviar el mensaje, por favor comuniquese via telefonica al: 2908 28 47');
        //}
      });
    };

    init();

    function init() {
    }
  }
})();