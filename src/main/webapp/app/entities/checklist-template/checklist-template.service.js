(function() {
    'use strict';
    angular
        .module('realtimeApp')
        .factory('Checklist_template', Checklist_template);

    Checklist_template.$inject = ['$resource'];

    function Checklist_template ($resource) {
        var resourceUrl =  'api/checklist-templates/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
