app.controller("welcome", function($scope, $rootScope, $state) {
    $.material.init()  // trigger material UI
    $scope.currentAuction = {}
    $scope.countDown = 90;
    $scope.timeUp = true;
    $scope.bid = {};
    $scope.seller = {
        amount: 150
    };

    /*checking for the user is already loged in*/
    socket.emit('welcomeReq', "data", function(response) {
        console.log(JSON.stringify(response))
        if (response.status == 200) {
            console.log(JSON.stringify(response))
            $scope.userDetails = response.data.userDetails[0];
            $scope.inventory = response.data.inventoryDetails[0]

            $scope.$apply();
        } else {
            console.log("invalid user name or password")
            $state.go('login')
        }
    });

/*setting auction value*/
    $scope.setAuction = function(type, count) {
        if (!$scope.auctionTimer) {
            $scope.bid.quantity = "";
            $scope.bid.amount = ""
            $('#auctionModal').modal('show')
            $scope.currentAuctionItem = type;
            $scope.selectedItem = {
                "item": type,
                "count": count
            }
        } else {

            $("#notifyMes").text("currently another auction in progress!!!!")
            $('.notify').fadeIn().delay(2000).fadeOut();
        }

    }

/*placing bid*/
    $scope.placeBid = function() {
        if ($scope.seller.amount > $scope.currentAuction.amount) {

            $("#notifyMes").text("The bid value must always be higher than the current winning bid, or at least equal to the minimum bid")
            $('.notify').fadeIn().delay(2000).fadeOut();
        } else {
            $("#notifyMes").text("biding is been placed successfully!!!!!!")
            $('.notify').fadeIn().delay(2000).fadeOut();
        }

    }

    /*After enter the biding quantity and amount trigger auctionBegin button to start the auction*/

    $scope.auctionBeing = function() {
        $scope.timeUp = true;
        $scope.currentAuction.amount = $scope.bid.amount;
        $('#currentAmount').val($scope.currentAuction.amount)
        $('#auctionModal').modal('hide')
        $("#notifyMes").text("bid successfully placed!!!!")
        $('.notify').fadeIn().delay(2000).fadeOut();
        var timer = setInterval(function() {
            $scope.countDown--;
            $scope.auctionTimer = true
            if ($scope.countDown < 10 && $scope.timeUp) {
                $scope.timeUp = false;
                $scope.countDown += 10;
            }
            $scope.$apply();
            if ($scope.countDown == 0) {
                clearInterval(timer);
                $scope.auctionTimer = false;
                $scope.countDown = 90;
                $scope.startAuction = false;
                if ($scope.seller.amount <= $scope.currentAuction.amount) {

                    $scope.bidingComp = true;
                    $("#auctionResult").modal('show')
                    $scope.inventory[$scope.selectedItem.item] = $scope.selectedItem.count - $scope.bid.quantity;
                    $scope.userDetails.balance = $scope.userDetails.balance - $scope.currentAuction.amount

                           socket.emit('updateUser', $scope.userDetails, function(response) {
                            if (response.status == 200) {
                              console.log(response)
                            } else {
                                console.log("invalid user name or password")
                            }
                        });
                           var auctionData = {
                            amount : $scope.currentAuction.amount,
                            quantity : $scope.bid.quantity
                           }
                           socket.emit('saveAuction',auctionData, function(response) {
                            if (response.status == 200) {
                              console.log(response)
                            } else {
                                console.log("some error occured while updating auction")
                            }
                        });
                           
                   setTimeout(function() {
                        $("#auctionResult").modal('hide')
                    }, 10000);
                } else {
                    $scope.bidingComp = false;
                    $("#auctionResult").modal('show')
                    setTimeout(function() {
                        $("#auctionResult").modal('hide')
                    }, 5000);
                }
                $scope.$apply();
            }
        }, 1000);

    }

/*logout the user*/
    $scope.logout = function() {
        socket.emit('logout', "data", function(response) {
            if (response.status == 200) {
                $state.go('login')
            } else {
                console.log("invalid user name or password")
            }
        });
    }
});