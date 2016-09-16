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
        autoAuthorize();
        
        function autoAuthorize() {
            realtimeUtils.authorize(loginSuccess, false);
        }
        
        vm.checklistQuestion = function(){        	
        }
        
        vm.treedata = [];
        vm.nodeArray = []
        
        function defineCheckList(){
        	gapi.drive.realtime.custom.registerType(vm.checklistQuestion, 'checklistQuestion');
        	
        	vm.checklistQuestion.prototype.id = gapi.drive.realtime.custom.collaborativeField('id');
        	vm.checklistQuestion.prototype.code = gapi.drive.realtime.custom.collaborativeField('code');
        	vm.checklistQuestion.prototype.description = gapi.drive.realtime.custom.collaborativeField('description');
        	vm.checklistQuestion.prototype.checklistId = gapi.drive.realtime.custom.collaborativeField('checklistId');
        	vm.checklistQuestion.prototype.checklistName = gapi.drive.realtime.custom.collaborativeField('checklistName');
        	vm.checklistQuestion.prototype.parentId = gapi.drive.realtime.custom.collaborativeField('parentId');
        	vm.checklistQuestion.prototype.parentDescription = gapi.drive.realtime.custom.collaborativeField('parentDescription');
        }
        
        function loginSuccess(response){
        	 if(!response.error){
        		            		    
        		    defineCheckList();
        		    
        	        var id = realtimeUtils.getParam('id');
        	        console.log('ID ' + id);
        	        id = '0BwnpBWDt6Xb7YWo5aVFFQTdUYlk';
        	        if (id) { 
        	        	console.log(' Method :  loginSuccess  -> info : ID is pre - defined');
        	        	realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
        	        } else {
        	        	console.log(' Method :  loginSuccess  -> info : ID is not defined');
        	        	realtimeUtils.createRealtimeFile('treedata', createFile);        	        		 
        	        }
             }
        }        

        var createFile =  function(createResponse) {
  			window.history.pushState(null, null, '?id=' + createResponse.id);
  			realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
		};
		
		var onFileInitialize = function onFileInitialize(model) {
			console.log(' Method :  onFileInitialize  -> info :');
			
			vm.treedata = model.createList();
			
			var node1 = model.create('checklistQuestion');			
			node1.id= 1;
			node1.code= "A";
			node1.description= "GENERAL FINANCIAL STATEMENT REQUIREMENTS";
			node1.checklistId=1;
			node1.checklistName= "Smaller Registrants (Form 10-K) and Other Public Entities";
			node1.parentId= null;
			node1.parentDescription= null;
			vm.treedata.push(node1);
			
			var node2 = model.create('checklistQuestion');
			node2.id= 2;
			node2.code= "B";
			node2.description= "BALANCE SHEET : ASSETS";
			node2.checklistId=2;
			node2.checklistName= "BALANCE SHEET : ASSETS";
			node2.parentId= null;
			node2.parentDescription= null;	
			vm.treedata.push(node2);
	
			var node3 = model.create('checklistQuestion');
			node3.id= 3;
			node3.code= "C";
			node3.description= "INCOME STATEMENT";
			node3.checklistId=3;
			node3.checklistName= "INCOME STATEMENT";
			node3.parentId= null;
			node3.parentDescription= null;
			vm.treedata.push(node3);
						
			model.getRoot().set('checklistQuestion', vm.treedata);
		}
        	        	
		var onFileLoaded = function onFileLoaded(doc) {
			console.log(' Method :  onFileLoaded  -> info :');
			vm.treedata = doc.getModel().getRoot().get('checklistQuestion');
			vm.nodeArray = vm.treedata.asArray();
			//vm.treedata[0].addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, updateRealtimeTextBox);
		}
		
		function updateRealtimeTextBox(collaborativeString) {
			console.log(' Method : updateRealtimeTextBox  -> info :');
			//var realtimeTextBox = document.getElementById('field_realtime');
	        //gapi.drive.realtime.databinding.bindString(collaborativeString, realtimeTextBox);
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
