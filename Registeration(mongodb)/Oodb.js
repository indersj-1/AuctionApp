var mongodb = require('./mongo_client'),
    ObjectId = require('mongodb').ObjectID;

var oodb = function (){  
   var self = this;
   self.get = function (query,callback){
   		
   		//{someField: 'myquery'}, {}, options
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

   }
};

module.exports = oodb;