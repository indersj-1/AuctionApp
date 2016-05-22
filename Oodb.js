var mongodb = require('./mongo_client'),
    ObjectId = require('mongodb').ObjectID;
    async = require('async')

var oodb = function (){  
   var self = this;
   self.userDetails = userDetails;
   self.inventoryDetails = inventoryDetails;



function inventoryDetails(query,callback){
          mongodb.db().collection("inventory").find().toArray(function(err, response) {
                if (!err  && response.length) {
                    callback({status:200, data:response})
                  }else{
                    console.log("checkInventory")
                    callback({status:500, msg:"no records available"}) 
                  }
                });
}


function userDetails(query, callback){
          console.log(query)
     id = new ObjectId()
      if(query.filter.id){
        query.filter._id = new ObjectId(query.filter.id)
        delete query.filter.id;
      }
      var sharedData = {};
            async.waterfall([checkUser, saveUser,checkInventory, saveInventory], function(response){
        callback(response)  
      })
          function checkUser(callback){
            console.log("checkUser user!!!!!!!!")
            console.log(query.filter)
            mongodb.db().collection(query.tableName).find(query.filter).toArray(function(err, response) {
                            if (!err  && response.length) {
                              console.log("data exixts....."+JSON.stringify(response))
                                callback({status:200, data:response})
                              }else{
                              console.log("funcking hell....")
                                callback()    
                              }
                             
                            });
          }

          function saveUser(callback){
            query.value.balance = 1000;
             mongodb.db().collection(query.tableName).insert(query.value, function(err, response){
                if(err){
                  console.log(err)
                    callback({status:500, msg:"some erro occured"});
                }else{
                  sharedData.users = response.ops;
                    callback()
                     
                  }
      });
          }


          function checkInventory(callback){

          mongodb.db().collection("inventory").find().toArray(function(err, response) {
                            if (!err  && response.length) {
                                callback({status:200, data:sharedData})
                              }else{
                              console.log("checkInventory")
                                callback()   
                              }
                            });
          }


          function saveInventory(callback){
            var inventory = {breads:30,carrots:18,diamond:1}
                    mongodb.db().collection("inventory").insertOne(inventory, function(err, response){
                if(err){
                  console.log(err)
                    callback({status:500, msg:"some erro occured"});
                }else{
                    callback({status:200, data:sharedData})
                     
                  }
      });
          }

}
};

module.exports = oodb;