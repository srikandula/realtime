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

        var clientId = '370295086792-2c0r6ve8mm7ot16ie1tq2ne9fe705ugg.apps.googleusercontent.com';
        var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
        
        vm.authorize = function authorize() {
            realtimeUtils.authorize(vm.loginSuccess, false);
        }
        
        vm.loginSuccess = function(response){
        	 if(!response.error){
        		    console.log(' Method : loginSuccess  -> info : Before getParam from realtimeUtils');
        	        var id = realtimeUtils.getParam('id');
        	        console.log('ID ' + id);
        	        id = '0BwnpBWDt6Xb7RkVTQ1JRaHZaVEE';
        	        console.log(' Method : loginSuccess  -> info : Before getParam from realtimeUtils-->' + id);
        	        if (id) {        	        	
        	        	console.log(' Method :  loginSuccess  -> info : ID is defined');
        	          realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
        	        } else {
        	        	console.log(' Method :  loginSuccess  -> info : ID is not defined');
        	          realtimeUtils.createRealtimeFile('treedata', 
        	        		  function(createResponse) {
        	        	  			window.history.pushState(null, null, '?id=' + createResponse.id);
        	        	  			realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
        	          		  });
        	        }
             }
        }        

        
		var onFileInitialize = function onFileInitialize(model) {
			console.log(' Method :  onFileInitialize  -> info :');
			var string = model.createString();
			string.setText('Question template model');
			console.log(' Method :  onFileInitialize  -> info : Added colloborative string to model -> ' +string);
			model.getRoot().set('treedata_demo_string', string);
		}
		
		var onFileLoaded = function onFileLoaded(doc) {
			console.log(' Method : onFileLoaded  -> info :');
		    var collaborativeString = doc.getModel().getRoot().get('treedata_demo_string');
		    console.log(' Method :  onFileLoaded  -> info :' + collaborativeString);
		    updateRealtimeTextBox(collaborativeString);
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
