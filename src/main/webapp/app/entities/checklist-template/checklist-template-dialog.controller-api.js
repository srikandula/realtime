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

        var CLIENT_ID = '370295086792-2c0r6ve8mm7ot16ie1tq2ne9fe705ugg.apps.googleusercontent.com';
        var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
        
        checkAuth();
        
		function checkAuth() {
			console.log(" Method : checkAuth -> Invoking authorize command");
			gapi.auth.authorize(
						{
							'client_id': CLIENT_ID,
							'scope': SCOPES.join(' '),
							'immediate': true
						}, handleAuthResult);
		}
		
		function handleAuthResult(authResult) {
			console.log(" Method : handleAuthResult -> Inside auth result");
			var authorizeDiv = document.getElementById('authorize-div');
			if (authResult && !authResult.error) {
				console.log(" Method : handleAuthResult -> success");
				loadDriveApi();
			}else{
				console.log(" Method : handleAuthResult -> failure");
			}
		}
		
		function loadDriveApi(){
			console.log(" Method : loadDriveApi -> Request to load drive API after auth");
			//gapi.load("auth:client,drive-realtime,drive-share", 'v3',onLoadRealtime);
			gapi.client.load('drive', 'v3', onLoadRealtime);
		}
	        
		function onLoadRealtime(){
			console.log(" Method : onLoadRealtimeOn -> Real time api load");
			gapi.drive.realtime.load('0BwnpBWDt6Xb7RkVTQ1JRaHZaVEE', onFileLoaded, initializeModel, onFileLoadError);
		}

        function onFileLoaded(doc){
			console.log(' Method : onFileLoaded -> Retrieved file from drive');			
			var collaborativeString = doc.getModel().getRoot().get('treedata_demo_string');
		    console.log(' Method : onFileLoaded  -> info :' + collaborativeString);
		    updateRealtimeTextBox(collaborativeString);
		}

		function initializeModel(model) {
			console.log(' Method : onFileInitialize  -> info :');
			var string = model.createString();
			string.setText('Question template model');
			console.log(' Method : onFileInitialize  -> info : Added colloborative string to model -> ' +string);
			model.getRoot().set('treedata_demo_string', string);
		}

		function onFileLoadError(data){
			console.log(' Method : onFileLoadError --> Error function' + data);
		}

		function updateRealtimeTextBox(collaborativeString) {
			console.log(' Method : updateRealtimeTextBox  -> info :');
			var realtimeTextBox = document.getElementById('field_realtime');
	        gapi.drive.realtime.databinding.bindString(collaborativeString, realtimeTextBox);
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
