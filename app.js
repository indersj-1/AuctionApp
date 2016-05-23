  var express = require("express"),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server);
  var session = require('express-session');

  var mongodb = require('./mongo_client');
  /*Mongo Db Query*/
  var oodb = require('./Oodb.js');
  var _oodb = new oodb();
  /*mongo Db url*/
  var url = 'mongodb://localhost:27017/auction';
  var config = {
          port: 80
      }

      /*Use connect method to connect to the Server*/ 
  mongodb.connect(url, function(err, db) {
      if (err) return
      console.log("mongo server connected...!!!!!")
  });

  app.use(session({
      secret: 'secret key'
  }));

  var userDetails;
  server.listen(config.port, function() {
      console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
  app.use(express.static(__dirname + '/www'));
  app.get('/', function(req, res) {
      res.sendfile(__dirname + '/www/pages/index.html');
  });

/*Checking Socket Connections*/

  io.on('connection', function(socket) {
      console.log("socket Connected!!!!!!!")

      /*emiting userLogin*/
      socket.on("userLoginReq", function(data, callback) {
          var query = {
              tableName: "users",
              filter: data,
              option: {},
              value: data
          };

          /*Query to get the records from mongoDB*/
          _oodb.userDetails(query, function(response) {
              if (response.status == 200) {
                  console.log("check user" + JSON.stringify(response))
                  if (response.data.users) {
                      userDetails = response.data.users[0];
                  } else {
                      userDetails = response.data[0];
                  }
                  callback({
                      status: 200,
                      response: response.data
                  });
              } else {
                  callback({
                      status: 500,
                      msg: response.msg
                  });
              }
          });
      })

      /*Query To update Records*/
      socket.on("updateUser", function(data, callback) {
          var query = {
              tableName: "users",
              filter: userDetails,
              option: {},
              value: data
          };
          _oodb.updateUser(query, function(response) {
              if (response.status == 200) {
                  callback({
                      status: 200,
                      data: response.data
                  });
              } else {
                  callback({
                      status: 500,
                      msg: response.msg
                  });
              }
          });
      });

/*query to save auction Note:this version i havent shown the history of auction but its been tracked in DB*/
      socket.on("saveAuction", function(data, callback) {
          console.log("userId" + userDetails._id)
          data.userId = userDetails._id
          console.log("bidingHistory!!!!!!!!!!!!!!" + JSON.stringify(data))
          var query = {
              tableName: "bidingHistory",
              filter: userDetails,
              option: {},
              value: data
          };
          _oodb.bidingHistory(query, function(response) {
              if (response.status == 200) {
                  callback({
                      status: 200,
                      data: response
                  });
              } else {
                  callback({
                      status: 500,
                      msg: response.msg
                  });
              }
          });

      })


      /*checking for user login*/
      socket.on("welcomeReq", function(data, callback) {
          console.log(userDetails)
          if (!userDetails) {
              console.log("logout!!!!!!")
              callback({
                  status: 500,
                  msg: "logout"
              });

          } else {
              var shareData = {}
              console.log("from Seesion first!!!" + JSON.stringify(userDetails))
              var query = {
                  tableName: "users",
                  filter: userDetails,
                  option: {},
                  value: {}
              };
              _oodb.userDetails(query, function(response) {
                  if (response.status == 200) {
                      shareData.userDetails = response.data
                      getInventory(callback)
                  } else {
                      callback({
                          status: 500,
                          msg: response.msg
                      });
                  }
              });
/*saving Inventory for first time Note:Each time if the new User Login the inventory will reset to actual value*/
              function getInventory(callback) {
                  _oodb.inventoryDetails(query, function(response) {
                      if (response.status == 200) {
                          shareData.inventoryDetails = response.data
                          callback({
                              status: 200,
                              data: shareData
                          });
                      } else {
                          callback({
                              status: 500,
                              msg: response.msg
                          });
                      }
                  });
              }
          }
      })

/*logout delete the session*/
      socket.on("logout", function(data, callback) {
          userDetails = "";
          callback({
              status: 200,
              response: "logout...."
          });
      })
  });



  // app.post('/registerUser', function(req, res) {
  //     var query = {
  //         tableName: "users",
  //         filter: {},
  //         option: {},
  //         value: req.body
  //     };
  //     _oodb.save(query, function(response) {
  //         if (response.status == 200) {
  //             res.send({
  //                 status: 200,
  //                 response: response.data
  //             })
  //             res.status(200)
  //         } else {
  //             res.send({
  //                 status: 500,
  //                 msg: response.msg
  //             })
  //             res.status(500)
  //         }
  //     });
  //     // _oodb.get(query,function(response){
  //     //  if(response.status==200){
  //     //    console.log(response.data)    
  //     //    res.send({status:200, response: response.data})
  //     //    res.status(200)
  //     //  }else{
  //     //    res.send({status:500, msg: response.msg})
  //     //    res.status(500)
  //     //    console.log(response.msg)
  //     //  }     
  //     // });

  // })