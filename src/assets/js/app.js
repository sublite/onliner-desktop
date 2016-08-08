var onlinerApp = angular.module('onlinerApp', ['ngRoute']);

onlinerApp.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'assets/views/main.html', controller:'usersController'})
                .when('/login', {templateUrl: 'assets/views/login.html'})
                .otherwise({redirectTo: '/'});
});

onlinerApp.factory("usersList", function() {
  // example for dataSet
  return [
    {
      name: 'Екатерина Готфрид',
      ava: 'https://pp.vk.me/c633116/v633116554/1a4a2/ZZNQJcLuKag.jpg',
      uid: '1',
      timeAlreadyFormattedAndCalculated: false,
      history: [[["enter_time"],["logout_time"],["type_of_device"]]]
    }
  ];
});

onlinerApp.filter("deviceConverter", function() {
  return function(param) {
    if (param == "1") {
      return "(mobile)";
    } else if (param == "0") {
      return "(desktop)";
    } else {
      return "";
    }
  };
});

onlinerApp.controller("usersController", ["$scope", "$http", "$location", "usersList", function($scope, $http, $location, usersList) {

  $scope.users = [];

  var cookie = getCookie('access_token');
  if (!cookie) {
    $location.path("/login");
  }

  $scope.$watchCollection("users", function(newVal, oldVal) {
    $scope.summary = calculateSummary($scope.users);
    $scope.users = newVal.map(mapFormatFunction);
  });

  $scope.gotoVKlogin = function() {
    var host = window.location.hostname;
    var CLIENT_ID = 5435590;
    location.href='https://oauth.vk.com/authorize?client_id='+CLIENT_ID+'&display=page&redirect_uri=http://'+host+'/auth.php&scope=friends&response_type=code&v=5.52';
  };

  function getAllUsersStats() {
    $http({method:'GET', url:'api.php', params: {'method':'getStats','uid': '8820037'}})
    .success(function(data) {
      var uids = [];
      var stories = [];

      for (var u in data) {
        uids.push(u);
        stories.push(data[u]);
      }
      var userIDs = uids.join(',');

      $http.jsonp('https://api.vk.com/method/users.get?user_ids='+userIDs+'&fields=photo_50&callback=JSON_CALLBACK')
      .success(function(data){
        for (var i in data.response) {
          var usersData = parseDataSet(i, data.response, stories);
          $scope.users.push({name: usersData.uName, ava: usersData.uAva, uid: usersData.userID, history: usersData.uStory});
        }
      })
      .then(function() {
        toggleInfoMsg();
      });
    });
  }
  getAllUsersStats();


  function showSumamry(uid) {
    $("#sum_"+uid).html($scope.summary[uid]);
  }

  $scope.addUser = function() {
    var userLink = $scope.userLink;
    var userID = getUIDFromProfileLink(userLink);
    if (!userID) {
      alert('incorrect profile URL');
    }

    toggleInfoMsg();

    $http({method:'GET', url:'api.php', params: {'method':'add','uid': userID}})
    .success(function(){
      $http.jsonp('https://api.vk.com/method/users.get?user_ids='+userID+'&fields=photo_50&callback=JSON_CALLBACK')
      .success(function(data){
          var uName = data.response[0].first_name + " " + data.response[0].last_name;
          var uAva = data.response[0].photo_50;
          $scope.users.push({name: uName, ava: uAva, uid: userID});
      })
      .then(function() {
        toggleInfoMsg();
      });
    });
  };

  $scope.removeUser = function(uid) {
      toggleInfoMsg();
      $http({method:'GET', url:'api.php', params: {'method':'remove','uid': uid}})
      .success(function(){
        $scope.users = $scope.users.filter(function(user) {
          if (user.uid != uid) {
            return true;
          } else {
            return false;
          }
        });
      })
      .then(function(){
        toggleInfoMsg();
      });
  };

  $scope.showHistory = function(uid) {
    $('.stats-logs-item').hide();
    if ($("div").is('#'+uid)) {
      $('#'+uid).show();
    } else {
      alert('статистики пока нет');
    }
    showSumamry(uid);
  };

}]);
