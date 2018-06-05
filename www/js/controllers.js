angular.module('starter.controllers', ['ionic-ratings'])


.controller('LoginCtrl', function($scope,$interval,$state,$http,$rootScope,$ionicPlatform,$ionicPopup,Idle,Keepalive,$cordovaGeolocation) {
    /*console.log(localStorage.getItem("checked"))
    if(localStorage.getItem("checked") != '' || localStorage.getItem("checked") != null ){
        $scope.user.username=localStorage.getItem("user");
        console.log($scope.user.username)
        $scope.user.password=localStorage.getItem("password");
        localStorage.getItem("checked");
      }
      else{
        $scope.user={username:"",password:""}
      }*/
 

 /*Login button above three buttons using selcet one group */
   /*$scope.audit=function(audit){
    $rootScope.logdata=audit;
      $ionicPlatform.registerBackButtonAction(function () {
      if (audit == "Audit") {
        $rootScope.backbutt();
      } 
      else{
        $rootScope.exitbutt();
     }
      }, 100);
   }*/
 /*login tab End*/



/*Login Function to using button*/
  $scope.user={username:"",password:""}
  $scope.checked=false;
  if(localStorage.getItem("remember") == true || localStorage.getItem("remember") == 'true'){
    $scope.checked=true;
    $scope.user.username=localStorage.getItem("user_name");
    $scope.user.password=localStorage.getItem("pass_word");
  }
  /*if(localStorage.getItem("remember") == false){
    $scope.user.username="";
    $scope.user.password="";
  }*/
    $scope.login=function(){
      localStorage.setItem("user",$scope.user.username);
      $rootScope.checkeddata=$scope.checked;
      $rootScope.username=$scope.user.username;
      $rootScope.password=$scope.user.password;

        var data ={
          "user_name":$scope.user.username,
          "password_digest":$scope.user.password
        };
        
        $http({
            method: 'post',
            url: CommonURL+'/api/v1/kitchen_users/dispatch_login',
            data: data     
            }).then(function(response) {
              if(response.data.hh == "Invalid"){
                alert("Invalid Credentials");
                 $scope.user.password="";
                  $rootScope.logdata="";
              }

              else{

              if (response.data.user_name==$scope.user.username){
                if(response.data.role_id == 5 ){
                  var tenids=response.data.tenant.toString()
                  localStorage.setItem("role_id",response.data.role_id);
                  localStorage.setItem("tenantids",tenids);
                  localStorage.setItem("users_id", response.data.id);
                  $state.go("app.home");
                  $ionicPlatform.registerBackButtonAction(function () {
                      if (response.data.role_id == 5) {
                        $rootScope.backbutt();
                      } 
                      else{
                        $rootScope.exitbutt();
                     }
                      }, 100);
                }
                else if(response.data.role_id == 6 ){
                  var tenids=response.data.tenant.toString()
                  localStorage.setItem("role_id",response.data.role_id);
                  localStorage.setItem("tenantids",tenids);
                  localStorage.setItem("users_id", response.data.id);
                  //console.log(localStorage.getItem("users_id"));
                  $state.go("menup.order");
                }
                else if(response.data.role_id == 11 ){
                  
                  alert("To Track Open  ID_TRACKER APPLICATION") 

                   var putdata={
                     "id":response.data.id
                   };
                    $http({
                      method: 'put',
                      url: CommonURL+'/api/v1/dispatch_logout',
                      data: putdata     
                    }).success(function(data) { 

                    })        

                 /*var tenids=response.data.tenant.toString()
                  localStorage.setItem("role_id",response.data.role_id);
                  localStorage.setItem("tenantids",tenids);
                  localStorage.setItem("users_id", response.data.id);
                  $state.go("navihome");
                  $ionicPlatform.registerBackButtonAction(function () {
                      if (response.data.role_id == 11) {
                        $rootScope.backbutt();
                      } 
                      else{
                        $rootScope.exitbutt();
                     }
                      }, 100);*/
                }
                else {
                  alert("Invalid Credentials")
                  $scope.user.password="";
                  $rootScope.logdata="";
                }
              }
              else{
                alert("Logged In Another Device");
                 $scope.user.password="";
                $rootScope.logdata="";
              }
            }
        })
    
    }/*login end*/
   
    
    
    /*logout button*/
    $scope.logout=function(){
      
      $ionicPopup.confirm({
        title: "Do you want to Logout?",
        template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
          buttons: [{ text: 'Yes',
            type: 'button-positive',
            onTap: function(){

              
              var putdata={
                 "id":localStorage.getItem("users_id"),
              };
              $http({
                method: 'put',
                url: CommonURL+'/api/v1/dispatch_logout',
                data: putdata     
              }).success(function(data) {
                /*if(localStorage.getItem("role_id") == 11){
                      $rootScope.intStop(); 
                }*/
                localStorage.clear();
                localStorage.setItem("remember",$rootScope.checkeddata);
                localStorage.setItem("user_name",$rootScope.username);
                localStorage.setItem("pass_word",$rootScope.password);
                if($rootScope.checkeddata != true || $rootScope.checkeddata == '' || $rootScope.checkeddata == null ||$rootScope.checkeddata == undefined){
                    $scope.user={username:"",password:""}
                    localStorage.clear();
                  }
                $state.go("login")

              })

            }
          },{
           text: 'cancel',
           type: 'button-danger',
           onTap: function(){}
        }]
      });
    }
  /*logout end*/
      

 })/*Controller end*/




.controller('HomeCtrl', function($scope,$filter,$state,$http,$ionicPopup,$controller) {
  $controller('commonCtrl', {$scope: $scope});



  var newdate = new Date();
  $scope.datenow = $filter('date')(newdate, "dd-MM-yyyy");
  localStorage.setItem("tdydate", $scope.datenow) 
    $http.get(CommonURL+"/api/v1/todaymenus?type="+$scope.datenow+"&tenant_id="+localStorage.getItem("tenantids"))
    .then(function(response) {
        $scope.todayorders = response.data.order; /*List from home page order in auditor Screen*/
        $scope.auditcount=0;
        for(var i in $scope.todayorders){
          if($scope.todayorders[i].delivery_status == 'Dispatched' || $scope.todayorders[i].delivery_status == 'Delivered' || $scope.todayorders[i].delivery_status == 'Completed'){
            $scope.auditcount+=1;
          }
        }
        $scope.totalval=$scope.auditcount;

        localStorage.setItem("total",$scope.totalval);
    });

  $scope.started=localStorage.getItem("lendata");

    /*To click the Audit on delivery service  food above name click to open prombt*/

    $scope.order=function(){

      $ionicPopup.confirm({
       title: "Do you want quit the Audit?",
       template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
       buttons: [
           { text: 'Yes',
             type: 'button-positive',
             onTap: function(){$state.go("app.home")}
           },
           {
             text: 'cancel',
             type: 'button-danger',
             onTap: function(){}
           }]
      });

    }


/*To click the order to open goto audit or feedback page*/

    $scope.delivery=function(meal_time,tenantname,flag_id,flag,tenantid,delivery_status,meal_restriction_id){
     if(flag == 1 || delivery_status == "Completed"){
      $ionicPopup.confirm({
       title: "Already Completed Audit & Go to Feedback",
       template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
       buttons: [
           { text: 'Yes',
             type: 'button-positive',
             onTap: function(){
              localStorage.setItem("tenant_id",tenantid);
              localStorage.setItem("flagsid",flag_id);
              localStorage.setItem("tenants_name",tenantname);
              localStorage.setItem("mealtime",meal_time);
              localStorage.setItem("meal_restriction_id",meal_restriction_id)
              $state.go("feedback")}
           },
           {
             text: 'cancel',
             type: 'button-danger',
             onTap: function(){}
           }]
      });
     }
     else{
      localStorage.setItem("tenant_id",tenantid);
      localStorage.setItem("flagsid",flag_id);
      localStorage.setItem("tenants_name",tenantname);
      localStorage.setItem("mealtime",meal_time);
      

      $ionicPopup.confirm({
       title: "Choose One",
       template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
       buttons: [
           { text: 'Audit',
             type: 'button-positive',
             onTap: function(){$state.go("tab.delivery")}
           },
           {
             text: 'Feedback',
             type: 'button-danger',
             onTap: function(){$state.go("feedback")}
           }]
      });

    }
  }
  
    $scope.tenant_name=localStorage.getItem("tenants_name");
    $scope.mealtype_name=localStorage.getItem("mealtime");
   

 })  /*End home controller*/


/*Start the User controller It can be used  only Username dispaleyed dispatch delivery auditor screens */

.controller('UserCtrl', function($scope,$filter) {
  $scope.usersname=localStorage.getItem("user");
  var newdate = new Date();
  $scope.datenow = $filter('date')(newdate, "dd-MM-yyyy");
  $scope.total=localStorage.getItem("total")

}) /*End user controller*/


/*To start Delivery controller from  Auditor screens*/

.controller('DeliveryCtrl', function($scope,$filter,$rootScope,$ionicModal,$state,$http,$controller) {
  $controller('commonCtrl', {$scope: $scope});


  $scope.minutees=[{ "time":"5 mins"},{"time":"10 mins"},{"time":"15 mins"},{"time":"20 mins"},{"time":"30 mins"},{"time":"30 mins+"}]

  /*this api used delivery page in auditor screens questions*/  
   $http.get(CommonURL+"/api/v1/deliveries?category=delivery")
    .then(function(response) {
        $scope.deliveries = response.data.Delivery[0];
        $scope.deliverie = response.data.Delivery[1];
    });
    /*end questions Api on delivery page*/


    /*this api using menus on delivery page*/

    $http.get(CommonURL+"/api/v1/menureviews?tenant_id="+localStorage.getItem("tenant_id")+"&date="+localStorage.getItem("tdydate")+"&meal_time="+localStorage.getItem("mealtime")+'&meal_restriction_id'+localStorage.getItem("meal_restriction_id"))
    .then(function(response) {
      $rootScope.menus=[]
      for(var i=0;i<response.data.MenuItems.length;i++){
       $rootScope.menus.push({"menu":response.data.MenuItems[i].menu})
      }
    });

    /*End food mrnu api*/


    /*This function used  array push in Food menu Item  */

     $rootScope.items = [];
     
      $scope.addNewfood = function () {
        
           $rootScope.items.push($scope.ans.mealmenu.menu);
       
        $rootScope.menus.splice($scope.ans.mealmenu.menu, 1); 
      }

      /*end add function */

      /*to remove the array in food*/

       $scope.remove = function (index,item) {
        $scope.items.splice(index, 1);

        $rootScope.menus.push({    
              'menu':item
            });
      };

      /*remove end */
      $scope.removeAll = function (){
         $http.get(CommonURL+"/api/v1/menureviews?tenant_id="+localStorage.getItem("tenant_id")+"&date="+localStorage.getItem("tdydate")+"&meal_time="+localStorage.getItem("mealtime")+'&meal_restriction_id'+localStorage.getItem("meal_restriction_id"))
            .then(function(response) {
              $rootScope.menus=[]
              for(var i=0;i<response.data.MenuItems.length;i++){
               $rootScope.menus.push({"menu":response.data.MenuItems[i].menu})
              }
            });
        $rootScope.items = []
       /*for(var i=1;i<$rootScope.items.length;i++){
        $scope.items.splice(i, 1)
       }*/
      }

    

    /*To start over all submit in delivery page on auditor*/

    $scope.ans={yesanswer:"",minutes:"",yeanswer:"",commentid:"",timesmin:""};

    $scope.deliver=function(delfirst_id,delsec_id){
    
    $rootScope.fooditems=$rootScope.items.toString();
    if ($scope.ans.yeanswer != null && $scope.ans.yeanswer != "") {
    
      var newdate = new Date();
      var datenow = $filter('date')(newdate, "dd-MM-yyyy");


      var data ={
        "answers":
        [
          {
          "question_id":delfirst_id,
          "answer":$scope.ans.yesanswer,
          "tenant_id":localStorage.getItem("tenant_id"),
          "meal_time":localStorage.getItem("mealtime"),
          "date":localStorage.getItem("tdydate"),
          "category":"Delivery",
          "command":$scope.ans.timesmin.time
          },
          {
          "question_id":delsec_id,
          "answer":$scope.ans.yeanswer,
          "tenant_id":localStorage.getItem("tenant_id"),
          "meal_time":localStorage.getItem("mealtime"),
          "date":localStorage.getItem("tdydate"),
          "command": $rootScope.fooditems,
          "category":"Delivery"
          }
        ]
      };
    
      $http({
          method: 'post',
          url: CommonURL+'/api/v1/answers',
          data: data     
          })
         .success(function(data) {
          localStorage.setItem("lendata",data.length)          
               alert("Message Saved ");
               $scope.ans="";
             $state.go("tab.service");
              })
  
   }
   else{
      alert("Please complete the Audit !");
       }
          
    }
    /*end delivery over all submit*/
})

/*end controller in delivery*/


/*To start Service controller on auditor Screen*/

.controller('ServiceCtrl', function($scope,$state,$http,$cordovaFileTransfer,$cordovaCamera,$rootScope) {
  
  /*Camera button to click open this function*/
  $scope.takePicture = function(image) {
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 500,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
    
      if(image == 'clean'){
        $scope.cleaner = "data:image/jpeg;base64," + imageData;
      }
      else if(image == 'glove'){
        $scope.gloveer = "data:image/jpeg;base64," + imageData;
      }  
      else if(image == 'water'){
        $scope.waterer = "data:image/jpeg;base64," + imageData;
      }
      else if(image == 'cutlery'){
        $scope.cutleryer = "data:image/jpeg;base64," + imageData;
      }
        
    });
  }/*end camera function*/


/*to use question  in service page in auditor*/

      $http.get(CommonURL+"/api/v1/deliveries?category=service")
      .then(function(response) {
          $scope.person = response.data.Service[0];
          $scope.clean = response.data.Service[1];
          $scope.glove = response.data.Service[2];
          $scope.water = response.data.Service[3];
          $scope.cutlery = response.data.Service[4];
      });

      /*end serveice question*/

  $scope.ans={personans:"",cleananswer:"",gloveanswer:"",wateranswer:"",cutanswer:"",pers:"",ques_id:"",no_of_person:""};

/*Service screen over all submit */
    $scope.service=function(person_id,clean_id,glove_id,water_id,cut_id){
      if ($scope.ans.cutanswer != null && $scope.ans.cutanswer != "") {

   
    var data ={
      "answers":
      [
        {
        "question_id":person_id,
        "answer":$scope.ans.personans,
        "tenant_id":localStorage.getItem("tenant_id"),
        "meal_time":localStorage.getItem("mealtime"),
        "date":localStorage.getItem("tdydate"),
        "comments":$scope.ans.no_of_person,
        "image_path":null,
        "category":"Service"
        },
        {
        "question_id":clean_id,
        "answer":$scope.ans.cleananswer,
        "tenant_id":localStorage.getItem("tenant_id"),
        "meal_time":localStorage.getItem("mealtime"),
        "date":localStorage.getItem("tdydate"),
        "comments":null,
        "image_path":$scope.cleaner,
        "category":"Service"
        },
        {
        "question_id":glove_id,
        "answer":$scope.ans.gloveanswer,
        "tenant_id":localStorage.getItem("tenant_id"),
        "meal_time":localStorage.getItem("mealtime"),
        "date":localStorage.getItem("tdydate"),
        "image_path":$scope.gloveer,
        "comments":null,
        "category":"Service"
        },
        {
        "question_id":water_id,
        "answer":$scope.ans.wateranswer,
        "tenant_id":localStorage.getItem("tenant_id"),
        "meal_time":localStorage.getItem("mealtime"),
        "date":localStorage.getItem("tdydate"),
        "image_path":$scope.waterer,
        "comments":null,
        "category":"Service"
        },
        {
        "question_id":cut_id,
        "answer":$scope.ans.cutanswer,
        "tenant_id":localStorage.getItem("tenant_id"),
        "meal_time":localStorage.getItem("mealtime"),
        "date":localStorage.getItem("tdydate"),
        "image_path":$scope.cutleryer,
        "comments":null,
        "category":"Service"
        }
      ]
    };
    
    $http({
        method: 'post',
        url: CommonURL+'/api/v1/answers',
        data: data     
        }).success(function(data) {
          alert("Message Saved ");
          $scope.ans="";
          $state.go("tab.food")
        });
    }
    else{
      alert("Please complete the Audit !");
    } 
  }

  /*end Service*/
  

})


/*to open food controller food page in Auditor screen*/

.controller('FoodCtrl', function($scope,$state,$http,$cordovaFileTransfer,$cordovaCamera,$rootScope,$parse) {

/*to take a camera function using food page*/
    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 500,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.foodaudit = "data:image/jpeg;base64," + imageData;
        });
    
  }

  /*to end food image*/

 



/*I declared statically wastage food reasons*/

  $scope.complaintfoods=[{"wastefood":"Burnt"},
                         {"wastefood":"Spicy"},
                         {"wastefood":"No Salt"},
                         {"wastefood":"Salty"},
                         {"wastefood":"Too Thick"},
                         {"wastefood":"Too Watery"},
                         {"wastefood":"UnderCooked"},
                         {"wastefood":"OverCooked"},
                         {"wastefood":"Not Available"},
                         {"wastefood":"Served Less"},
                         {"wastefood":"Cold"},
                         {"wastefood":"Other"}]
/*to static end*/

/*to declare complaint food  push in array */
  $scope.ans={mealmenu:"",mealsquality:"",}
  $rootScope.items = [];
  $scope.addNewfood = function () {
   $rootScope.items.push({    
      'foodmenuitem':$scope.ans.mealmenu.namefood,
      'reason':$scope.ans.mealsquality.wastefood,
      'normal_menu_id':$scope.ans.mealmenu.food_id,
      "image_path":$scope.foodaudit
   });
  } /*To end food array*/

  /*to remove complaint food array*/
  $scope.remove = function (index) {
    $scope.items.splice(index, 1);
  };
  /*To array complaint */


/*to get app from food menus in food screen in auditor screens*/

  $http.get(CommonURL+"/api/v1/menureviews?tenant_id="+localStorage.getItem("tenant_id")+"&date="+localStorage.getItem("tdydate")+"&meal_time="+localStorage.getItem("mealtime")+'&meal_restriction_id'+localStorage.getItem("meal_restriction_id"))
  .then(function(response) {
      $rootScope.foods = response.data.MenuItems;
      });

/*end epi from food menu*/

/*if you click complaint the value save form the item of food in araay to show in dropdown*/
$scope.ans={compliantanswer:"",comment:""};
  $rootScope.itemsOffood=[]
  $scope.fooditem=function(food){
    var itemfood=false;
    for(var i=0;i<$rootScope.itemsOffood.length;i++){
      if($rootScope.itemsOffood[i].namefood == food.menu){
        itemfood=true;
      }
    }
    if(itemfood != true){
      $rootScope.itemsOffood.push({'namefood':food.menu,'food_id':food.id});
    }
  }/*end to declare food in complaint answer*/

  /*to remove above declare the food in no complaint*/
  $scope.removefood=function(val){
    var itemfood=false;
    for(var i=0;i<$rootScope.itemsOffood.length;i++){
      if($rootScope.itemsOffood[i].namefood == val){
        itemfood=true;
       }
     }
     if(itemfood == true){
        var index = $scope.itemsOffood.indexOf(val);
      $scope.itemsOffood.splice(index, 1);     
     }
  }/*to end remove food */



/*over all submit from food in auditor screens*/
  $scope.food=function(){
     var menudata = {
        "tenant_id": localStorage.getItem("tenant_id"),
        "date": localStorage.getItem("tdydate"),
        "meal_time": localStorage.getItem("mealtime")
      }
      $http({
        method: 'post',
        url: CommonURL+'/api/v1/menudetails',
        data: menudata     
       }).then(function(response) {
        $rootScope.foodmenu_id=response.data.id
       
   
     $rootScope.menureviews=[];
      for(var i=0; i < $rootScope.foods.length;i++){
        $rootScope.menureviews.push({
          "normal_menu_id":$rootScope.foods[i].id,
          "answer": $scope.ans.compliantanswer[i],
          "foodmenu_id": $rootScope.foodmenu_id,
          "tenant_id":localStorage.getItem("tenant_id"),
          "date": localStorage.getItem("tdydate"),
          "meal_time": localStorage.getItem("mealtime"),
          "created_by":localStorage.getItem("users_id"),
          "category":"Food"
        })
      }

      


      var data ={
          "menureviews" : 
            $rootScope.menureviews
       };
        $http({
          method: 'post',
          url: CommonURL+'/api/v1/menureviews',
          data: data     
          }).success(function(data) {
        
      
      var fooddata ={ 
        "fooddata":
          $rootScope.items
       };
        $http({
          method: 'post',
          url: CommonURL+'/api/v1/menureviews/update_image',
          data: fooddata     
          }).success(function(data) {
        }); 



      var putdata={
         "id":localStorage.getItem("flagsid"),
         "delivery_status":"Delivered",
         "flag":1
      };
      $http({
        method: 'put',
        url: CommonURL+'/api/v1/status',
        data: putdata     
        })

      .success(function(data) {
        alert("Created Successfully");
        $scope.ans="";
        localStorage.setItem("foodmenu_id","");
        $state.go("feedback");
       });
      });
    });
  }/*to end food over all submit*/


})/*food controller  end*/


/*to start feed back conroller in auditor per student */
.controller('FeedbackCtrl', function($scope,$rootScope,$state,$http,$controller) {
  $controller('commonCtrl', {$scope: $scope});

/*Statically declare the reasons for food*/
  $scope.complaintfoods=[{"wastefood":"Burnt"},
                         {"wastefood":"Spicy"},
                         {"wastefood":"No Salt"},
                         {"wastefood":"Salty"},
                         {"wastefood":"Too Thick"},
                         {"wastefood":"Too Watery"},
                         {"wastefood":"UnderCooked"},
                         {"wastefood":"OverCooked"},
                         {"wastefood":"Not Available"},
                         {"wastefood":"Served Less"},
                         {"wastefood":"Cold"},
                         {"wastefood":"Other"}]


/*to get Api from Age type dropdown */
  $http.get(CommonURL+"/api/v1/customers?tenant_id="+localStorage.getItem("tenant_id")+"&date="+localStorage.getItem("tdydate")+"&meal_time="+localStorage.getItem("mealtime")+"&type=feedback")
  .then(function(response) {
      $scope.agetype = response.data.Feedback.age_type;
  });

/*to get response for least and most favorite food */

  $http.get(CommonURL+"/api/v1/menureviews?tenant_id="+localStorage.getItem("tenant_id")+"&date="+localStorage.getItem("tdydate")+"&meal_time="+localStorage.getItem("mealtime")+'&meal_restriction_id'+localStorage.getItem("meal_restriction_id"))
  .then(function(response) {
      $scope.mostfavdish = response.data.MenuItems;
      $scope.leastfavdish = response.data.MenuItems;
              
  });


/*to click rating call back object */
  
  $scope.ratingsObject = {
    iconOn : 'ion-happy',
    iconOff : 'ion-happy-outline',
    iconOnColor: '#4B4B4D',
    iconOffColor: '#4B4B4D',
    rating:  0,
    minRating: 0,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };

  /*rating function to get value from numbers*/
  $scope.ratingsCallback = function(rating) {
    $scope.ratingval=rating;
  };
  /*to end function in rating*/



    $scope.ans={age_select:"",mfd_select:"",lfd_select:"",comments:"",name:"",mealsquality:""};


/*over all submit feedback */

   $scope.feedback=function(){
    var data ={
                "username":$scope.ans.name,
                "age_type":$scope.ans.age_select.key,
                "rating":$scope.ratingval,
                "tenant_id":localStorage.getItem("tenant_id"),
                "favourite_dish":$scope.ans.mfd_select.menu,
                "least_dish":$scope.ans.lfd_select.menu,
                "comment":$scope.ans.comments,
                "reason":$scope.ans.mealsquality.wastefood,
                "date":localStorage.getItem("tdydate")

              };
    
    $http({
        method: 'post',
        url: CommonURL+'/api/v1/customers',
        data: data     
        }).success(function(data) {
          alert("Successfully Added ");
          $scope.ans=''
          window.location.reload(true); 
    }); 

  }

  /*close feedback*/

/*exit the screen to go to home page*/
  $scope.exit=function(){
         $state.go("app.home");
  }
/*end*/


})/*end feed back controller*/
