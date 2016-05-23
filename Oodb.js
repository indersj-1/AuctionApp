var mongodb = require('./mongo_client'),
    ObjectId = require('mongodb').ObjectID;
async = require('async')

var oodb = function() {
    var self = this;
    self.userDetails = userDetails;  //save userdata
    self.inventoryDetails = inventoryDetails; // save inventory each time when user login. Note:it reset to default value
    self.updateUser = updateUser; // udate user Data
    self.bidingHistory = bidingHistory;// track the biding auction data.

    function inventoryDetails(query, callback) {
        mongodb.db().collection("inventory").find().toArray(function(err, response) {
            if (!err && response.length) {
                callback({
                    status: 200,
                    data: response
                })
            } else {
                console.log("checkInventory")
                callback({
                    status: 500,
                    msg: "no records available"
                })
            }
        });
    }

    function bidingHistory(query, callback){
        query.value.created = Math.floor(Date.now() / 1000);
        console.log("bidingHistory"+JSON.stringify(query))
                mongodb.db().collection(query.tableName).insert(query.value, function(err, response) {
                if (err) {
                    console.log(err)
                    callback({
                        status: 500,
                        msg: "some erro occured"
                    });
                } else {
                    callback({
                        status: 200,
                        msg: "updated"
                    })

                }
            });
        
    }

function updateUser(query, callback){
  console.log("USEWRupdate!!!!!!!!!!!!!!!!!!!!!!")
      console.log(query)
        _id = new ObjectId()
        if (query.filter._id) {
            query.filter._id = new ObjectId(query.filter._id)
            
        }
        delete query.value._id
    console.log(query)

             mongodb.db().collection(query.tableName).update({'_id':query.filter._id}, {$set: query.value}, function(err, response) {
                if (err) {
                    console.log(err)
                    callback({
                        status: 500,
                        msg: "some erro occured"
                    });
                } else {
                    callback({
                        status: 200,
                        msg: "success!!!"
                    })

                }
            });

}

    function userDetails(query, callback) {
        console.log(query)
        _id = new ObjectId()
        if (query.filter._id) {
            query.filter._id = new ObjectId(query.filter._id)
        }
        var sharedData = {};
        async.waterfall([checkUser, saveUser, checkInventory, saveInventory], function(response) {
            callback(response)
        })

        function checkUser(callback) {
            console.log("checkUser user!!!!!!!!")
            console.log(query.filter)
            mongodb.db().collection(query.tableName).find(query.filter).toArray(function(err, response) {
                if (!err && response.length) {
                    console.log("data exixts....." + JSON.stringify(response))
                    callback({
                        status: 200,
                        data: response
                    })
                } else {
                    console.log("funcking hell....")
                    callback()
                }

            });
        }

        function saveUser(callback) {
            query.value.balance = 1000;
            mongodb.db().collection(query.tableName).insert(query.value, function(err, response) {
                if (err) {
                    console.log(err)
                    callback({
                        status: 500,
                        msg: "some erro occured"
                    });
                } else {
                    sharedData.users = response.ops;
                    callback()

                }
            });
        }


        function checkInventory(callback) {
            mongodb.db().collection("inventory").find().toArray(function(err, response) {
                if (!err && response.length) {
                    callback({
                        status: 200,
                        data: sharedData
                    })
                } else {
                    console.log("checkInventory")
                    callback()
                }
            });
        }


        function saveInventory(callback) {
            var inventory = {
                breads: 30,
                carrots: 18,
                diamond: 1
            }
            mongodb.db().collection("inventory").insertOne(inventory, function(err, response) {
                if (err) {
                    console.log(err)
                    callback({
                        status: 500,
                        msg: "some erro occured"
                    });
                } else {
                    callback({
                        status: 200,
                        data: sharedData
                    })

                }
            });
        }

    }
};

module.exports = oodb;