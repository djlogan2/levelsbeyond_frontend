"use strict";
/*
Your task is to integrate with the Github REST API to search for issues in the Angular Github repo for the
previous 7 days.
Use the Github Issues API. Working with AngularJS or ReactJS will be seen as a plus, we want to see how you
work in the languages we use here at Levels Beyond. With the results from the API, display, in HTML, the
returned values with their title, body, user login, and assignee login.

   issue[x].title
   issue[x].body
   issue[x].user.login
   issue[x].assignee.login
 */

mainApp.controller("mainController", function($scope, $http){
    var self = this;
    self.getData = function(days, callback) {
        var date = new Date();
        date.setDate(date.getDate()-days);
        console.log('Getting issues for ' + date.toISOString());
        $http({
            method: 'GET',
            url: 'https://api.github.com/repos/angular/angular/issues?since=' + date.toISOString()
        }).then(function(response) {
            var data = [];
            response.data.forEach(function(r){
                data.push({title: r.title, body: r.body, user: (r.user && r.user.login) || '', assignee: (r.assignee && r.assignee.login) || ''});
            });
            callback(data);
        }).catch(function(error){
            console.log('What to do here?');
        });
    };

    $scope.search = {
        days: 7,
        title: '',
        body: '',
        user: '',
        assignee: ''
    };
    $scope.data = [];

    $scope.$watch('search.days', function(newValue, oldValue){
        self.getData(newValue, function(data){$scope.data=data;});
    });
});
