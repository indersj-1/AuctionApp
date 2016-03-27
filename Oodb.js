var mongodb = require('./mongo_client'),
    ObjectId = require('mongodb').ObjectID;
    async = require('async')

var oodb = function (){  
   var self = this;


   self.get = function (query,callback){
   		id = new ObjectId()
   		if(query.filter.id){
   			query.filter._id = new ObjectId(query.filter.id)
   			delete query.filter.id;
   		}
   		console.log(query);
   		console.log(query.filter)
   		 				    mongodb.db()
                            .collection(query.tableName)
                            .find(query.filter)
                            .toArray(function(err, response) {
                            if (err) {
                            		 callback({status:500,msg:"some error occured"}) 
                            		}
                            		   callback({status:200, data:response})
                            		   mongodb.close();
                            });

   };

   self.save = function(query,callback){
   		console.log(query)
   		if(query.value.email){
   			query.value._id = query.value.email;
   			delete query.value.email;
   		}
   		


			async.waterfall([fetchUser, saveUser], function(response){
				callback(response)	
			})


		function fetchUser(callback){
			console.log("fetchUser")
			mongodb.db()
	        .collection(query.tableName)
	        .find({_id:query.value._id})
	        .toArray(function(err, response) {
	        if (err){
	        		 callback({status:500,msg:"some error occured"}) 
	        		}else{
	        			console.log(response.length)
	     	        	if(response.length == 0){
	        				console.log("no user found")
	        				saveUser(callback)		
	        			}else{
	        				console.log('user found')
	        				callback({status:500,msg:"User Already exists"})			
	        			}	        		 
	        		}
	        		  
	        		 //  mongodb.close();
	        });

		}

		function saveUser(callback){
			console.log("saveUser")
			 mongodb.db().collection(query.tableName).insertOne(query.value, function(err, response){
   			  if(err){
   			  	console.log("saveUser erro occured")
   			  	console.log(err)
   			  		callback({status:500, msg:"some erro occured"});
   			  }else{
   			  	console.log("saveUser success")
   			      callback({status:200, data:response})
        		   
   			    }
        		// mongodb.close();	
   		});

		}
  
   }

};

module.exports = oodb;