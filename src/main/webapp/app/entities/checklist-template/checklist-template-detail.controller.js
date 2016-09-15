(function() {
    'use strict';

    angular
        .module('realtimeApp')
        .controller('Checklist_templateDetailController', Checklist_templateDetailController);

    Checklist_templateDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Checklist_template'];

    function Checklist_templateDetailController($scope, $rootScope, $stateParams, previousState, entity, Checklist_template) {
        var vm = this;

        vm.checklist_template = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('realtimeApp:checklist_templateUpdate', function(event, result) {
            vm.checklist_template = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
