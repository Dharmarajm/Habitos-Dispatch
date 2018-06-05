angular.module('starter.deliveries', [])


/*To start navigate controler from delvery app home screen controller*/

.controller('NavigateCtrl', function($scope,$state,$http,$filter,$ionicModal,$ionicPopup,$timeout,$rootScope) {
  
  var newdate = new Date();
  $scope.datenow = $filter('date')(newdate, "dd-MM-yyyy");
  localStorage.setItem("tdydate", $scope.datenow);
    
    $http.get(CommonURL+"/api/v1/todaymenus?type="+$scope.datenow+"&tenant_id="+localStorage.getItem("tenantids"))
        .then(function(response) {
            $scope.todayorders = response.data.order;/*to get all data from display navihom page*/
    });
    $scope.doRefresh=function(){
      $http.get(CommonURL+"/api/v1/todaymenus?type="+$scope.datenow+"&tenant_id="+localStorage.getItem("tenantids"))
          .then(function(response) {
              $scope.todayorders = response.data.order;/*to get all data from display navihom page*/
      });
      $timeout( function() {
      $scope.$broadcast('scroll.refreshComplete');
      
      },1000);
    };

    $http.get(CommonURL+"/api/v1/tenants")
        .then(function(response) {
            $scope.tenantorders = response.data;
    }); 

    /*to click the navaihome order to open the popup screen functions*/
$rootScope.CheckedStatus=[]
    $scope.navi=function(tenant_name,mealtime,tenantid,destinations,flag_id,status,lat,longt){

    
      var destination=lat+','+longt;
      localStorage.setItem("tenantname", tenant_name);
      localStorage.setItem("tenantidnav", tenantid);
      localStorage.setItem("meal_time", mealtime);
      localStorage.setItem("destinate",destination);
      localStorage.setItem("flag_id", flag_id);
      console.log(localStorage.getItem("destinate"));

      if(status == "Delivered" || status == "Completed"){

        $ionicPopup.confirm({
          title: "Delivery Already Completed",
          template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
           buttons: [{
             text: 'cancel',
             type: 'button-danger',
             onTap: function(){}
           }]
         });
   
      }
      else{

      $ionicModal.fromTemplateUrl('templates/navcheck.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.modal = modal;
          $http.get(CommonURL+"/api/v1/histories?date="+localStorage.getItem("tdydate")+"&tenant_id="+localStorage.getItem("tenantidnav")+"&meal_time="+localStorage.getItem("meal_time"))
          .then(function(response) {
              $scope.historydatas = response.data.history.dispatch;
              
              $scope.historyreturn = response.data.history.return;
              for(var i=0;i<$scope.historydatas.length;i++){
               
                $rootScope.CheckedStatus.push({
                  "dispatch_id":$scope.historydatas[i].dispatch_id,
                  "is_checked":$scope.historydatas[i].is_checked,
                  "reason":'',
                  "dispatch_qty":null
                })
                //$scope.historydatas.push("new_qty":$scope.historydatas[i].quantity);
              }
              console.log($scope.historydatas);
             });
           $scope.modal.show();
          }); 
      }; 
    };
    /*to end the popup on navigate function*/

    /*this history to used time management on start to end delivery screens*/

    $scope.history=function(tenant_name,tenantid,mealtime){
        $scope.tenantname=tenant_name;

        $ionicModal.fromTemplateUrl('templates/navhistory.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.modal = modal;

        $http.get(CommonURL+"/api/v1/histories?date="+localStorage.getItem("tdydate")+"&tenant_id="+tenantid+"&meal_time="+mealtime+"&history=true")
          .then(function(response) {
              $scope.historydatas = response.data.history.dispatch;
              $scope.historyreturn = response.data.history.return;
          });

          $http.get(CommonURL+"/api/v1/delivery_histories?date="+localStorage.getItem("tdydate")+"&tenant_id="+tenantid+"&meal_time="+mealtime)
          .then(function(response) {
              $scope.historytimes = response.data;
              
             });
           $scope.modal.show();
          }); 
      }
      /*To end history*/
      $scope.val=[]
      $scope.Ischeck = function(item,ischeck,index) {
        //$scope.require="require"+index
        console.log(item)
        var subindex = $rootScope.CheckedStatus[index].dispatch_id == item.dispatch_id;
          if(subindex > -1){
            $rootScope.CheckedStatus[index].is_checked = ischeck
            $scope.historydatas[index].is_checked=ischeck;
          }
          
          
          //console.log($scope.val)
      };


    
      
      /*Any popup to close Use this function*/
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      /*end popup*/


      /*open popup to accept click the button */
     // $scope.quanti_val={}
      $scope.Check=function(){
        for(var i in $scope.historydatas){
          //console.log($scope.historydatas[i].dummy_qty)
          /*if($scope.quanti_val[i] == "" || $scope.quanti_val[i] == null){
            alert("Please Enter Reason and Quantity")
            break;
          }*/
          if($rootScope.CheckedStatus[i].is_checked == true){
            //$rootScope.CheckedStatus[i].reason = $scope.val[i]
            $rootScope.CheckedStatus[i].dispatch_qty = $scope.historydatas[i].dummy_qty
          }
          else{
            $rootScope.CheckedStatus[i].reason = ''
          }
            
        }
        console.log($rootScope.CheckedStatus);

        var declinedata={
          "data":
           $rootScope.CheckedStatus
        };
     
        $http({
          method: 'put',
          url: CommonURL+'/api/v1/update_is_checked',
          data: declinedata     
        }).then(function(response) {
          var status=true;
            for(var i in $rootScope.CheckedStatus){
              if($rootScope.CheckedStatus[i].is_checked == false){
                status=false
                break;
              }              
            }
            if(status != false){
             $scope.is_fully_dispatched=true;
            }
            else{
             $scope.is_fully_dispatched=false; 
            }
           
           var putdata={
            
            "id":localStorage.getItem("flag_id"),
            "delivery_status":"Dispatched",
            "is_fully_dispatched":$scope.is_fully_dispatched

            };
         
          $http({
              method: 'put',
              url: CommonURL+'/api/v1/status',
              data: putdata     
            }).then(function(response) {
                    $state.go("navigate");
                    $scope.modal.hide();
              });
            });
       
      };/*end accept page button*/    
   
})/*navigate controller*/


/*to open the map this controller work in map screens*/
.controller('MapCtrl', function($scope,$ionicLoading,$http,$interval,$timeout,$rootScope,$filter,$ionicModal,$ionicPopup,$state,$cordovaGeolocation,$document) {





  $scope.doRefresh=function(){
   
    var options = {timeout: 5000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      $scope.mapStaus=1;
      $scope.livecurrent=position.coords.latitude+","+position.coords.longitude;
      $timeout(function () {
      $ionicLoading.hide();
    }, 1000);
    },function(error){
      $scope.mapStaus=0;
      alert("Not work")
      //return;
    });
   $timeout( function() {
     $scope.$broadcast('scroll.refreshComplete');
    },1000);
  }

  /*This is used cordova geolocation get starting positions*/
$ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $scope.mapStaus=0;
  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    $scope.mapStaus=1;
    $scope.livecurrent=position.coords.latitude+","+position.coords.longitude;
   $scope.sources=position.coords.latitude+","+position.coords.longitude;
      $timeout(function () {
    $ionicLoading.hide();
  }, 1000);
 
    },function(error){
    console.log(error);
    cordova.plugins.locationAccuracy.canRequest(function(canRequest){
    console.log(canRequest);
    if(canRequest){
        cordova.plugins.locationAccuracy.request(function(){
            console.log("Request successful");
            $scope.doRefresh();
        }, function (error){
            console.error("Request failed");
            if(error){
                console.error("error code="+error.code+"; error message="+error.message);
                if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                    if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                        cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                }
            }
        }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
        );
    }
})
  $scope.mapStaus=0;
   alert("Please Turn On GPS Location & Pull To Refresh ")


  $timeout(function () {
    $ionicLoading.hide();
  }, 1000);
 
  });
  
  /*end get geoloaction*/
 
 /*every 5 seconds move to the falg in map to use this functions*/
 /*$rootScope.postinterval = $interval(function () {
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      console.log(position)
      $scope.livecurrent=position.coords.latitude+","+position.coords.longitude;
    var date = new Date();
    $scope.timeCur = $filter('date')(new Date(), 'hh:mm:ss a');
      var data ={
        
    "map_detail" :
    
        {
        "latitude": position.coords.latitude,
        "longitude": position.coords.longitude,
        "time":  $scope.timeCur,
        "description" : "default"
        }
      };

      $http({
            method: 'post',
            url: 'http://192.168.1.59:3005/api/v1/map_details',
            data: data    
          }).then(function(response){
          console.log(response,"lat&long")
          });

    });
  },50000 )*/


$rootScope.postinterval = $interval(function () {
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      console.log(position)
      $scope.livecurrent=position.coords.latitude+","+position.coords.longitude;
    })
  },5000 * 60)


 $rootScope.intStop = function() {
      $interval.cancel($rootScope.postinterval);
      $interval.cancel(interval);
    };
  
  /*Every five minutes get directions and distance send ERB screens*/

  var interval = $interval(function () {
     $scope.newDirctions();
  },5000 * 60)

 


/*To click the pause button to open a dropdown emergiences call*/

$scope.emergencies=[{"reason":"Fuel"},{"reason":"Puncture"},{"reason":"Accident"},{"reason":"Breakdown"},{"reason":"Other"}]

  $rootScope.pause_time=[];
  $rootScope.resume_time=[]

  /*to get directions from start button and the time distance value send this functions*/
  $scope.getDirections = function (val) {

$scope.doRefresh();
  

    $scope.val=val
      
    if(val == "start"){
      $scope.time=new Date();
      var starttime=$filter('date')($scope.time, "h:mm:ss a");
      $rootScope.start_time=starttime;
      $scope.destinate=localStorage.getItem("destinate");
    }
    else if(val == "pause"){
      $scope.time=new Date();
      var pausetime=$filter('date')($scope.time, "h:mm:ss a");
      $rootScope.pause_time.push(pausetime)
    } 

    else if(val == "resume"){
      $scope.time=new Date();
      var resumetime=$filter('date')($scope.time, "h:mm:ss a");
      $rootScope.resume_time.push(resumetime)
    } 
    else if(val == "stop"){

      /*if you click deliverd button to start this complet delivery function and popup */

      $ionicPopup.confirm({
        title: "Do you want End journey?",
        template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
          buttons: [{ text: 'Yes',
          type: 'button-positive',
          onTap: function(){$scope.completeDelivery();}
        },{
           text: 'cancel',
           type: 'button-danger',
           onTap: function(){}
        }]
      });
      
      /*complete the delivery to start this fubnction*/
     
      $scope.completeDelivery=function(){ 
        $scope.time=new Date();
        $scope.stoptime=$filter('date')($scope.time, "h:mm:ss a");
        var data={
          "date":localStorage.getItem("tdydate"),
          "start_time":$rootScope.start_time,
          "pause_time":$rootScope.pause_time,
          "resume_time":$rootScope.resume_time,
          "tenant_id":localStorage.getItem("tenantidnav"),
          "created_by":localStorage.getItem("users_id"),
          "meat_time":localStorage.getItem("meal_time"),
          "stop_time":$scope.stoptime
        };
        $http({
          method: 'post',
          url: CommonURL+'/api/v1/delivery_histories',
          data: data     
        }).then(function(response) {
          var putdata={
            "id":localStorage.getItem("flag_id"),
            "delivery_status":"Delivered"
           };
          $http({
            method: 'put',
            url: CommonURL+'/api/v1/status',
            data: putdata     
          }).then(function(response){
            $rootScope.intStop(); 
            $state.go('navihome')})
        })
      } /*to end complete delivery*/
    }/*to close the if condtions*/
  }/*to end the getdirections*/

  $scope.open = function () {
    var modalInstance = ({
      animation: false,
     
      resolve: {
        items: function () {
          return;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
    });
  };


  



/*start button to open this every five seconds*/
$scope.newDirctions = function () {

  $scope.timer=new Date();

  var directionsService = new google.maps.DirectionsService();

    var request = {
      origin: $scope.livecurrent,
      destination: localStorage.getItem("destinate"),
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {


      $scope.distance=response.routes[0].legs[0].distance.text
      $scope.duration=response.routes[0].legs[0].duration.text
      console.log($scope.distance);
      var data ={
        "date": localStorage.getItem("tdydate"), 
        "tenant_id": localStorage.getItem("tenantidnav"), 
        "meal_time": localStorage.getItem("meal_time"),
        "delivery_time": $scope.duration,
        "time":$scope.timer,
        "distance":$scope.distance,
        "delivery_status": "Start"
      };
      $http({
            method: 'post',
            url: CommonURL+'/api/v1/delivery_updates',
            data: data    
          }).then(function(response){

          });


    });
  
  };

  /*to stop the dirctions and delivered the options*/

  $scope.stopdirections = function () {

    $scope.timer=new Date();

  var directionsService = new google.maps.DirectionsService();

    var request = {
      origin: $scope.livecurrent,
      destination: localStorage.getItem("destinate"),
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {


      $scope.distance=response.routes[0].legs[0].distance.text
      $scope.duration=response.routes[0].legs[0].duration.text
      console.log($scope.distance);
      var data ={
        "date": localStorage.getItem("tdydate"), 
        "tenant_id": localStorage.getItem("tenantidnav"), 
        "meal_time": localStorage.getItem("meal_time"),
        "delivery_time": $scope.duration,
        "time":$scope.timer,
        "distance":$scope.distance,
        "delivery_status": "Delivered"
      };
      $http({
            method: 'post',
            url: CommonURL+'/api/v1/delivery_updates',
            data: data    
          }).then(function(response){

          });


    });
  
  };/*to end stop directions*/


  /*if you click the pause button to open dropdown to send this reason */

  $scope.reason = function (emergency) {

    $scope.timer=new Date();

  var directionsService = new google.maps.DirectionsService();

    var request = {
      origin: $scope.livecurrent,
      destination: localStorage.getItem("destinate"),
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      $scope.distance=response.routes[0].legs[0].distance.text
      $scope.duration=response.routes[0].legs[0].duration.text
      console.log($scope.distance);
      var data ={
        "date": localStorage.getItem("tdydate"), 
        "tenant_id": localStorage.getItem("tenantidnav"), 
        "meal_time": localStorage.getItem("meal_time"),
        "delivery_time": $scope.duration,
        "distance":$scope.distance,
        "delivery_status": "Paused",
        "time":$scope.timer,
        "remark":emergency.reason
      };
      $http({
            method: 'post',
            url: CommonURL+'/api/v1/delivery_updates',
            data: data    
          }).then(function(response){

          });


    });
  }
/*end reason*/

$scope.restart = function (emergency) {

$scope.timer=new Date();
  var directionsService = new google.maps.DirectionsService();

    var request = {
      origin: $scope.livecurrent,
      destination: localStorage.getItem("destinate"),
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      $scope.distance=response.routes[0].legs[0].distance.text
      $scope.duration=response.routes[0].legs[0].duration.text
      console.log($scope.distance);
      var data ={
        "date": localStorage.getItem("tdydate"), 
        "tenant_id": localStorage.getItem("tenantidnav"), 
        "meal_time": localStorage.getItem("meal_time"),
        "delivery_time": $scope.duration,
        "distance":$scope.distance,
        "delivery_status": "resume",
        "time":$scope.timer,
      };
      $http({
            method: 'post',
            url: CommonURL+'/api/v1/delivery_updates',
            data: data    
          }).then(function(response){

          });


    });
  }
  
})
/*end map controller*/
