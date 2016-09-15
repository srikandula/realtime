(function() {
    'use strict';

    angular
        .module('realtimeApp')
        .controller('Checklist_templateController', Checklist_templateController);

    Checklist_templateController.$inject = ['$scope', '$state', 'Checklist_template'];

    function Checklist_templateController ($scope, $state, Checklist_template) {
        var vm = this;
        
        vm.checklist_templates = [];

        loadAll();

        function loadAll() {
            Checklist_template.query(function(result) {
                vm.checklist_templates = result;
            });
        }
    }
})();
