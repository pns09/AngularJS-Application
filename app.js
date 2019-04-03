var app = angular.module('newapp', ["ngRoute"])

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        template: `<h1>Welcome to Root Page!!!</h1>`,

    })
        .when('/signup', {
            templateUrl: '/signup.html',
            controller: 'signupController',
            resolve: ['protect', function (protect) {
                return protect.protect()
            }]
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'loginController',
            // resolve: ['protect', function (protect) {
            //     return protect.protect()
            // }]
        })
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'homeController',
            resolve: ['protect', function (protect) {
                return protect.protect()
            }]
        })
        .when('/message', {
            templateUrl: 'message.html',
            controller: 'messageController',
            resolve: ['protect', function (protect) {
                return protect.protect()
            }]
        })
        .when('/message/:details', {
            templateUrl: 'messageDetails.html',
            controller: 'detailsController',
            resolve: ['protect', function (protect) {
                return protect.protect()
            }]
        })
        .when('/logout', {
            templateUrl: 'logout.html',
            controller: 'logoutController',
            resolve: ['protect', function (protect) {
                return protect.protect()
            }]
        }).otherwise('/')
})
app.factory('protect', function ($location, $window) {
    return {
        protect: function () {
            if (!JSON.parse( $window.localStorage.getItem('Username'))) {
                $location.path(["/signup"])
            }

        }
    }
})

app.controller('mainController', function ($scope, $window,$location) {

    $scope.logged_out = true;
    $scope.logged_in = false;
    $scope.user = $window.localStorage.getItem("Username");

    if ($scope.user == "") {
        $scope.logged_out = true;
        $scope.logged_in = false;
    } else {
        $scope.logged_out = false;
        $scope.logged_in = true;
    }

    $scope.$on("logging_in", function (event,obj) {
        console.log(obj.username);
        if (obj.username) {
            console.log("LOggedIn");
            $scope.logged_out = false;
            $scope.logged_in = true;
        }
    })
    $scope.logout = function () {
        $scope.logged_out = true;
        $scope.logged_in = false;
    }

//     $scope.isActive = function(viewLocation)
// {
//     console.log(viewLocation);
//     console.log(viewLocation===$location.path());
//     return viewLocation ===$location.path();
// }
})

app.controller('signupController', function ($scope, $location, $window) {
    $scope.register = function () {
        $scope.previous = JSON.parse($window.localStorage.getItem('Registered')) || [];
        if ($scope.username != undefined && $scope.password != undefined && $scope.fname != undefined && $scope.lname != undefined && $scope.phone != undefined && $scope.gender != undefined) {

            $scope.store = {
                "username": $scope.username,
                "password": $scope.password,
                "fname": $scope.fname,
                "lname": $scope.lname,
                "phone": $scope.phone,
                "gender": $scope.gender

            }


            $scope.previous.push($scope.store)
            $window.localStorage.setItem('Registered', JSON.stringify($scope.previous))


            $window.localStorage.setItem('Username', JSON.stringify($scope.store.username))
            $window.localStorage.setItem('Password', JSON.stringify($scope.store.password))
            $location.path(['/login'])
        } else {

            $window.localStorage.setItem('error', false)
            $scope.error = '*Enter all the fields'
            $location.path(['/signup'])

        }
    }
})

app.controller('loginController', function ($scope, $location, $window) {


    $scope.login = function () {
        $scope.log = JSON.parse($window.localStorage.getItem('Registered')) || [];
        console.log($scope.log)
        for (var i = 0; i < $scope.log.length; i++) {
            if ($scope.username == undefined || $scope.password == undefined || $scope.username != $scope.log[i].username || $scope.password != $scope.log[i].password) {

                $scope.error = '*Invalid Credentials.Try again!!'
            }
            else {
                $scope.$emit("logging_in", { username: $scope.username });
                $location.path(['/home'])
            
                $window.localStorage.setItem('Username', JSON.stringify($scope.username))
            }
        }

        $scope.filter = JSON.parse($window.localStorage.getItem('Messages')) || []

    }

})

app.controller('homeController', function ($scope, $window) {

    $scope.heading = JSON.parse($window.localStorage.getItem('Username')) || ""

})

app.controller('messageController', function ($scope, $window,$rootScope) {

    // $scope.messages = [

    //     {
    //     sender: 'rahul',
    //     message: "this is rahul's message",
    //     receiver:'sri',
    //     important: "yes"

    // },
    // {
    //     sender: "charan",
    //     message: "charan messaged you",
    //     receiver:'sri',
    //     important: "yes"

    // },
    // {
    //     sender: "ashwith",
    //     message: "ashwith messaged you",
    //     receiver:'sri',
    //     important: "yes"

    // },
    // {
    //     sender: "sai",
    //     message: "this is sai message ",
    //     receiver:'sri',
    //     important: "yes"

    // },
    // {
    //     sender: "charan",
    //     message: "charan message",
    //     receiver:'rahul',
    //     important: "yes"

    // }
    // ]
    // $window.localStorage.setItem('Messages',JSON.stringify($scope.messages))

    $scope.local = JSON.parse($window.localStorage.getItem('Messages')) || [];
    $scope.user = JSON.parse($window.localStorage.getItem('Username')) || "";
    $rootScope.urmsg = [];
    for (var j = 0; j < $scope.local.length; j++) {

        if ($scope.local[j].receiver == $scope.user) {

            $scope.urmsg.push($scope.local[j]);
        }
    }

    $scope.remove = function(item) {
        console.log(item)
        console.log($scope.urmsg)
        // console.log($scope.local.indexOf[item])
        // var index = $window.localStorage.getItem('Messages').indexOf[item];
        $scope.urmsg.splice($scope.urmsg.indexOf(item), 1);
        $scope.local.splice($scope.local.indexOf(item), 1);
        $window.localStorage.setItem('Messages', JSON.stringify($scope.local))
    }
    $scope.update = function (properties) {


        if ($scope.local[$scope.local.indexOf(properties)].important == "yes") {
            $scope.local[$scope.local.indexOf(properties)].important = "no"
        }
        else {
            $scope.local[$scope.local.indexOf(properties)].important = "yes"
        }
        $window.localStorage.setItem('Messages', JSON.stringify($scope.local))


    } 

})
app.controller('detailsController', function ($scope, $rootScope, $routeParams, $location, $window) {
    var id= $routeParams.details
    // $scope.msg = JSON.parse($window.localStorage.getItem('Messages')) ||[];
    $scope.showdetails = $rootScope.urmsg[id]
    console.log($scope.showdetails)
    $scope.back = function () {
        $location.path(['/message'])
    }
    $scope.send = function () {
        $scope.messages = JSON.parse($window.localStorage.getItem('Messages')) ||[];
        $scope.uname = JSON.parse($window.localStorage.getItem('Username')) || '';

        $scope.obj = {
            sender: $scope.uname,
            message: $scope.sendermsg,
            receiver: $scope.showdetails.sender,
            important: "no"
        }
        $scope.messages.push($scope.obj)
        $window.localStorage.setItem('Messages', JSON.stringify($scope.messages))
    }

})

app.controller('logoutController', function ($window, $location) {
    $location.path(['/login'])
    $window.localStorage.setItem("Username", JSON.stringify(""));

})
