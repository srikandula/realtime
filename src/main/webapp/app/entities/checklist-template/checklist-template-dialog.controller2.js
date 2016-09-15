(function() {
    'use strict';

    angular
        .module('realtimeApp')
        .controller('Checklist_templateDialogController', Checklist_templateDialogController);

    Checklist_templateDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Checklist_template'];

    function Checklist_templateDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Checklist_template) {
        var vm = this;

        vm.checklist_template = entity;
        vm.clear = clear;
        vm.save = save;
        vm.realtime = "<to be updated>";

        gapi.load("auth:client,drive-realtime,drive-share", onLoadRealtime);

		function onLoadRealtime(){
			console.log("On real time api load");
			gapi.drive.realtime.load('0BwnpBWDt6Xb7QThINUp2QWRENFE', onFileLoaded, initializeModel, opt_errorFn);
		}

        function onFileLoaded(){
			console.log('Retrieved file from drive');
		}

		function initializeModel(model) {
			console.log('Inside initializer function');
			vm.realtime = model.createString("Hello Realtime World!");
			model.getRoot().set("text", vm.realtime);
		}

		function opt_errorFn(){
			console.log('Error function');
		}

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.checklist_template.id !== null) {
                Checklist_template.update(vm.checklist_template, onSaveSuccess, onSaveError);
            } else {
                Checklist_template.save(vm.checklist_template, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('realtimeApp:checklist_templateUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
