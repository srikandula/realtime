(function() {
    'use strict';

    angular
        .module('realtimeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('checklist-template', {
            parent: 'entity',
            url: '/checklist-template',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'realtimeApp.checklist_template.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/checklist-template/checklist-templates.html',
                    controller: 'Checklist_templateController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('checklist_template');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('checklist-template-detail', {
            parent: 'entity',
            url: '/checklist-template/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'realtimeApp.checklist_template.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/checklist-template/checklist-template-detail.html',
                    controller: 'Checklist_templateDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('checklist_template');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Checklist_template', function($stateParams, Checklist_template) {
                    return Checklist_template.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'checklist-template',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('checklist-template-detail.edit', {
            parent: 'checklist-template-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/checklist-template/checklist-template-dialog.html',
                    controller: 'Checklist_templateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Checklist_template', function(Checklist_template) {
                            return Checklist_template.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('checklist-template.new', {
            parent: 'checklist-template',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/checklist-template/checklist-template-dialog.html',
                    controller: 'Checklist_templateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                question: null,
                                description: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('checklist-template', null, { reload: 'checklist-template' });
                }, function() {
                    $state.go('checklist-template');
                });
            }]
        })
        .state('checklist-template.edit', {
            parent: 'checklist-template',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/checklist-template/checklist-template-dialog.html',
                    controller: 'Checklist_templateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Checklist_template', function(Checklist_template) {
                            return Checklist_template.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('checklist-template', null, { reload: 'checklist-template' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('checklist-template.delete', {
            parent: 'checklist-template',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/checklist-template/checklist-template-delete-dialog.html',
                    controller: 'Checklist_templateDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Checklist_template', function(Checklist_template) {
                            return Checklist_template.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('checklist-template', null, { reload: 'checklist-template' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
