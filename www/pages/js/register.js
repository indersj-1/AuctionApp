app.controller("registerUser", function($scope, $rootScope, $http) {
    $scope.registerUser = {
        firstName: "Inder",
        lastName: "Singh",
        address: "bangalre",
        city: "bangalore",
        state: "karnataka",
        zip: 549009,
        title: "Nodejs MongoDB and Angularjs",
        company: "Indersj",
        phoneNo: 94084876551,
        website: "www.indersj.com"
    }



    $scope.completeRegister = function() {
        if (!$scope.form.$invalid) {
            //alert("form submit");
            $http.post("/registerUser", JSON.stringify($scope.registerUser)).success(function(data, status) {
                console.log(data)
            })
        } else {
            alert("check all the filed")
        }
    };

});