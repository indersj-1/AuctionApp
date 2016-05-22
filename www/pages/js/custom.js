var app = angular.module('myApp', ['ui.router']);

          app.config(function($stateProvider, $urlRouterProvider) {
    
            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                  .state('register', {
                    url: '/register',
                    templateUrl: 'pages/register.html',
                    controller : "registerUser"
                })
              
               .state('login', {
                    url: '/',
                    templateUrl: 'pages/login.html',
                    controller : "loginController"
                }) 

                .state('welcome', {
                    url: '/welcome',
                    templateUrl: 'pages/welcome.html',
                    controller : "welcome"
                }) 
      });
        app.controller("welcome", function($scope, $rootScope,$state) {
            $.material.init()
            $scope.currentAuction = {}
            $scope.countDown = 15;    
            $scope.timeUp = true;
            $scope.bid = {};
            $scope.seller = {amount:150};
            socket.emit('welcomeReq',"data",function(response){
              console.log(JSON.stringify(response))
              if(response.status == 200){
               console.log(JSON.stringify(response))
                $scope.userDetails =response.data.userDetails[0];
                $scope.inventory = response.data.inventoryDetails[0]

                $scope.$apply();
                }else{
                console.log("invalid user name or password")
                $state.go('login')
                }
            });

             $scope.setAuction = function(type,count){
              //alert(type+""+count)
             if(!$scope.auctionTimer){
                  $scope.bid.quantity = "";
                  $scope.bid.amount = ""
               $('#auctionModal').modal('show')
                  $scope.currentAuctionItem = type;
                  $scope.selectedItem = {"item":type,"count":count}              
             }else{
              
              $("#notifyMes").text("currently another auction in progress!!!!")
              $('.notify').fadeIn().delay(2000).fadeOut();
             }

             }

             $scope.placeBid = function(){
              if($scope.seller.amount>$scope.currentAuction.amount){

              $("#notifyMes").text("The bid value must always be higher than the current winning bid, or at least equal to the minimum bid")
              $('.notify').fadeIn().delay(2000).fadeOut();   
              }else{
                $("#notifyMes").text("biding is been placed successfully!!!!!!")
              $('.notify').fadeIn().delay(2000).fadeOut(); 
              }
             
             }

             $scope.auctionBeing = function(){
              $scope.timeUp = true;
                $scope.currentAuction.amount =  $scope.bid.amount;
                $('#currentAmount').val($scope.currentAuction.amount )
                $('#auctionModal').modal('hide')
                $("#notifyMes").text("bid successfully placed!!!!")
                $('.notify').fadeIn().delay(2000).fadeOut();
               
              var timer = setInterval(function(){
              $scope.countDown--;
              $scope.auctionTimer = true
              if($scope.countDown < 10 &&  $scope.timeUp){
                 $scope.timeUp = false;
                $scope.countDown += 10;   
              }
              $scope.$apply();
              if($scope.countDown == 0){
              clearInterval(timer);
              $scope.auctionTimer = false;
              $scope.countDown = 15;
              $scope.startAuction = false;
                if($scope.seller.amount<=$scope.currentAuction.amount){
                    $("#auctionResult").modal('show')
                    setTimeout(function(){ $("#auctionResult").modal('hide') }, 10000);
                }
              $scope.$apply();
              }
              }, 1000); 

             }

             $scope.logout = function(){
          socket.emit('logout',"data",function(response){
              if(response.status == 200){
                  $state.go('login')
                }else{
                console.log("invalid user name or password")
                }
            });
             }
        });

        app.controller("loginController", function($scope, $rootScope,$state) {
        $.material.init()
          $scope.siginPage = function(){
            socket.emit('userLoginReq', $scope.login,function(response){
                if(response.status == 200){
                $scope.userDetails = response;
                $state.go('welcome')
                }else{
                console.log("invalid user name or password")
                }
            });
          }

         socket.emit('welcomeReq',"data",function(response){
              console.log(JSON.stringify(response))
              if(response.status == 200){
                  $state.go('welcome')
                }else{
                console.log("invalid user name or password")
                }
            });

        // $scope.siginPage = function(){
        //     socket.emit('userLoginReq', $scope.login);
        //     socket.on ('userLoginRes', function (response) {
        //     console.log(JSON.stringify(response))
        //     if(response.status == 200){
        //       $rootScope.userDetails = response;
        //       $state.go('welcome')
        //     }else{
        //       console.log("invalid user name or password")
        //     }
        //     });

        //   }
                
        });


        app.controller("registerUser",function($scope, $rootScope, $http){
               $scope.registerUser = {
               		firstName : "Inder",
               		lastName : "Singh",
               		address : "bangalre",
               		city : "bangalore",
               		state : "karnataka",
               		zip : 549009,
               		title : "Nodejs MongoDB and Angularjs",
               		company : "Indersj",
               		phoneNo : 94084876551,
               		website : "www.indersj.com"
               }



               $scope.completeRegister = function(){
               		if(!$scope.form.$invalid){
               			//alert("form submit");
                            $http.post("/registerUser", JSON.stringify($scope.registerUser)).success(function(data, status) {
                             console.log(data)
                          })
               		}else{
               			alert("check all the filed")
               		}	
               };

        });