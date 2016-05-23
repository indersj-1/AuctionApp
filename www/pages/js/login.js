app.controller("loginController", function($scope, $rootScope, $state) {
    $.material.init() // Trigerring material UI
    /*requeing for sing-in*/
    $scope.siginPage = function() {
        socket.emit('userLoginReq', $scope.login, function(response) {
            if (response.status == 200) {
                $scope.userDetails = response;
                $state.go('welcome') // will route to welcome page
            } else {
                console.log("invalid user name or password")
            }
        });
    }

        /*checking user is already is sigin while opeing new tab*/
    socket.emit('welcomeReq', "data", function(response) {
        console.log(JSON.stringify(response))
        if (response.status == 200) {
            $state.go('welcome')
        } else {
            console.log("invalid user name or password")
        }
    });


});