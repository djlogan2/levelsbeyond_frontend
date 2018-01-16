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

var re = /<(.*)>;\s+rel="next",\s+<(.*)>;\s+rel="last"/;

function recursiveHTTP($http, url, data, callback) {
    $http({
        method: 'GET',
        url: url
    }).then(function (response) {
        var links = re.exec(response.headers('Link'));
        response.data.forEach(function (r) {
            data.push({
                title: r.title,
                body: r.body,
                user: (r.user && r.user.login) || '',
                assignee: (r.assignee && r.assignee.login) || ''
            });
        });
        if (!links)
            callback(data);
        else
            recursiveHTTP($http, links[1], data, callback);
    }).catch(function (error) {
        console.log('What to do here?');
    });
}

mainApp.controller("mainController", function($scope, $http){
    var self = this;
    self.getData = function(days, callback) {
        var date = new Date();
        date.setDate(date.getDate()-days);
        console.log('Getting issues for ' + date.toISOString());
        recursiveHTTP($http, 'https://api.github.com/repos/angular/angular/issues?since=' + date.toISOString(), [], callback);
    };

    $scope.search = {
        days: 7,
        title: '',
        body: '',
        user: '',
        assignee: ''
    };
    $scope.data = [];
    $scope.count = 0;

    $scope.$watch('search.days', function(newValue, oldValue){
        self.getData(newValue, function (data) {
            $scope.data = data;
            $scope.count = data.length;
            console.log('Returning ' + data.length + ' records');
        });
    });
});
