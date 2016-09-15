(function() {
    'use strict';

    angular
        .module('realtimeApp')
        .controller('Checklist_templateDeleteController',Checklist_templateDeleteController);

    Checklist_templateDeleteController.$inject = ['$uibModalInstance', 'entity', 'Checklist_template'];

    function Checklist_templateDeleteController($uibModalInstance, entity, Checklist_template) {
        var vm = this;

        vm.checklist_template = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Checklist_template.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
