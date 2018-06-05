angular.module('starter.dispatch', [])

/*oit can be used tabs order page and history page*/

.controller('TabsCtrl', function($scope,$state){
  //$scope.tabactive='order';
   $scope.order=function(){
    $scope.tabactive='order';
    $state.go('menup.order');
   }
   $scope.history=function(){
    $scope.tabactive='history'
    $state.go('menup.history');
  } 
})

/*To open the order controller in dispatch App*/
.controller('OrderCtrl', function($scope,$state,$http,$filter,ionicDatePicker,$ionicPopup,$rootScope,$timeout,$controller) {
  $controller('commonCtrl', {$scope: $scope});
 
 /*$scope.orderss=function(value){
  $scope.show=value;
 }*/
  $rootScope.datevalue='';
  var newdate = new Date();
  $scope.datenow = $filter('date')(newdate, "dd-MM-yyyy");
  $scope.datee = $filter('date')(newdate, "dd-MMMM-yyyy");
  $scope.day = $filter('date')(newdate, "EEEE");
  localStorage.setItem("tdydate", $scope.datenow);


  $scope.doRefresh=function(date,history){
    if($rootScope.datevalue == '' || $rootScope.datevalue == null){
      var newdate = new Date();
      $scope.datenow = $filter('date')(newdate, "dd-MM-yyyy");
    }
    else{
      $scope.datenow=$rootScope.datevalue;
    }


    $http.get(CommonURL+"/api/v1/todaymenus?type="+$scope.datenow+"&tenant_id="+localStorage.getItem("tenantids"))
      .then(function(response) {
      
        $scope.todayorders = response.data.order;/*it used orders list*/
       
        $scope.tenantorders=[];/*it used dropdown tenants*/
        for(var i=0;i<$scope.todayorders.length;i++){
          $scope.tenantorders.push({"name":$scope.todayorders[i].tenant.name}) 
        }
     
      
      })
    $timeout( function() {

     $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);

    }


    $http.get(CommonURL+"/api/v1/todaymenus?type="+$scope.datenow+"&tenant_id="+localStorage.getItem("tenantids"))
      .then(function(response) {
        $scope.todayorders = response.data.order;/*it used orders list*/
        $scope.tenantorders=[];/*it used dropdown tenants*/
        for(var i=0;i<$scope.todayorders.length;i++){
          $scope.tenantorders.push({"name":$scope.todayorders[i].tenant.name}) 
        }
      });

    /*this is used date picker callback previous day to return Allowed*/
    var ipObj1 = {
      callback: function (val) {  
        $scope.Historydate= new Date(val);
        $scope.historydatenow = $filter('date')($scope.Historydate, "dd-MM-yyyy");
        $rootScope.datevalue=$scope.historydatenow;
        $scope.histrydatenow = $filter('date')($scope.Historydate, "dd-MMMM-yyyy");
        $scope.histrydaynow = $filter('date')($scope.Historydate, "EEEE");         

        $http.get(CommonURL+"/api/v1/todaymenus?type="+$scope.historydatenow+"&tenant_id="+localStorage.getItem("tenantids"))
        .then(function(response) {

          $scope.todayorders = response.data.order;
            $scope.tenantorders=[]
              for(var i=0;i<$scope.todayorders.length;i++){
                $scope.tenantorders.push({"name":$scope.todayorders[i].tenant.name}) 
              }
            
         });
      },
      from:new Date(2012, 1, 1),
      //from:new Date().setDate(new Date().getDate()-1), //Optional
      to: new Date(),
      inputDate: new Date()
     
    };
    /*end previous day callback option*/

    /*to open datepicker above function*/
    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
    /*End date picker*/

    /*to click orders in orders ready to go itemsoftoday start dispatch this function*/
    $scope.itemsoftoday=function(tenant_name,mealtime,flagid,tenant_id,status,order){
     var newdate = new Date();
      $scope.checkdate = $filter('date')(newdate, "yyyy-MM-dd");
     
     if($scope.checkdate != order.date){
        alert(" Date Has Already Expired !")
     }
     else{
//console.log(order.meal_restriction_id)
     localStorage.setItem("historydate", order.date);

      $scope.item_qty='';
      localStorage.setItem("tenantsid", tenant_id);
      localStorage.setItem("flagsid", flagid);
      localStorage.setItem("tenantname", tenant_name);
      localStorage.setItem("meal_time", mealtime);
      localStorage.setItem("restrict_id", order.meal_restriction_id);
      if( status=="Dispatched" || status=="Completed" || status=="packed" || status=="Delivered"){
        $ionicPopup.confirm({
          title: "Dispatch Already Completed",
          template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
           buttons: [{
             text: 'cancel',
             type: 'button-danger',
             onTap: function(){}
           }]
        });
      }
      else{
        $state.go('menup.itemsofday');
      }
    }
  } /*end odrder to item of today page*/

  /*to click orders in orders ready to go itemsoftoday start dispatch this function*/
    $scope.EditDispatch=function(tenant_name,mealtime,flagid,tenant_id,status,order){
     var newdate = new Date();
      $scope.checkdate = $filter('date')(newdate, "yyyy-MM-dd");
     
     if($scope.checkdate != order.date){
        alert(" Date Has Already Expired !")
     }
     else{

     localStorage.setItem("historydate", order.date);

      $scope.item_qty='';
      localStorage.setItem("tenantsid", tenant_id);
      localStorage.setItem("flagsid", flagid);
      localStorage.setItem("tenantname", tenant_name);
      localStorage.setItem("meal_time", mealtime);
      if(status=="packed"){
        $ionicPopup.confirm({
          title: "Dispatch Already Completed",
          template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
           buttons: [{
             text: 'cancel',
             type: 'button-danger',
             onTap: function(){}
           }]
        });
      }
      else{
        $state.go('menup.Editdispatch');
      }
    }
  } /*end odrder to item of today page*/


    /*This is goto return food page */
    $scope.returnfood=function(mealtime,tenant_id,flagid,tenant_name,order){


      localStorage.setItem("historydate", order.date);

     $http.get(CommonURL+"/api/v1/dispatch_utensil_ids?tenant_id="+tenant_id+"&date="+localStorage.getItem("historydate")+"&meal_time="+mealtime+"&meal_restriction_id="+order.meal_restriction_id)
      .then(function(response) {
        $scope.returnutensil = response.data.utensil_id;
        localStorage.setItem("tenantname", tenant_name);
        localStorage.setItem("returnmealtime", mealtime);
        localStorage.setItem("returntenant_id", tenant_id);
        localStorage.setItem("returnflagid", flagid);
        localStorage.setItem("meal_time",mealtime);
        localStorage.setItem("meal_restriction",order.meal_restriction_id);

        if($scope.returnutensil.length != 0){
          $state.go('menup.return');
        }
        else{
          $ionicPopup.confirm({
            title: "Already Returned",
            template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
            buttons: [{
              text: 'cancel',
              type: 'button-danger',
              onTap: function(){}
           }]
          })
        }

      });
    }/*End this return page*/

    /*if click wastage button to go to waste return page*/
    $scope.wastagefood=function(mealtime,tenant_id,tenant_name,order){

      localStorage.setItem("historydate", order.date);
      localStorage.setItem("tenantname", tenant_name);
      localStorage.setItem("wastagemealtime", mealtime);
      localStorage.setItem("wastetenant_id", tenant_id);
      $state.go('menup.wastage');
    }/*end wastage*/
})

/*To start the ITem controller in dispatch order */

.controller('ItemsCtrl', function($scope,$rootScope,$ionicPopup,$state,$http,$timeout, $filter,$controller) {
  $controller('commonCtrl', {$scope: $scope});
    


    $scope.tenantname=localStorage.getItem("tenantname");
    $scope.mealtypename=localStorage.getItem("meal_time");
    var newdate = new Date();
    $scope.datee = $filter('date')(newdate, "dd-MMMM-yyyy");
    $scope.day = $filter('date')(newdate, "EEEE");
/*if used food select in dropdown in items of today page  function*/
 

  $scope.logdata = function(activecla){

    if(activecla == null || activecla == ''){
      $scope.itemname = '';
      $scope.item_qty =null;
    }
    else{
      $scope.itemname=activecla.item_name;
      $scope.itemid=activecla.item_id;
      $scope.item_qty=activecla.totalqty;
      $rootScope.newitem_qty=activecla.totalqty;
    }
  }

  /*This api used utensils item show in drop down*/
  $http.get(CommonURL+"/api/v1/utensilsnames")
    .then(function(response) {
        $scope.utensilsitems = response.data;
  });



  /*if you send utensils id get utens number every ustensid to display in next dropdown */
  $scope.utens=function(utensitem){
    if(utensitem == null){
      $scope.utensilslength = 0;
      $scope.multi_utensil=false;
    }
    else{
    $http.get(CommonURL+"/api/v1/utensils?id="+utensitem.id)
      .then(function(response) {
        if(response.data == null){
          $scope.utensilslength = 0;
          $scope.utensils = null;
          $scope.multi_utensil=false;
        }
        else{
          $scope.utensilslength = 1;
          $scope.utensils = response.data.namelist;
          $scope.utensils_count = response.data.count;
          
          if($scope.ans.utensitem.status=='Multiple'){
            $scope.multi_utensil=true; 
          }else{
           $scope.multi_utensil=false;  
          }
            
          for(var k=0;k<$rootScope.items.length;k++){
            /*for (var i = 0; i<$rootScope.items[k].no_of_utensil.length; i++) {*/
              for (var j = 0; j<$scope.utensils.length; j++) {
                if ($rootScope.items[k].no_of_utensil==$scope.utensils[j].utensil_id) {
                  $scope.utensils = $scope.utensils.slice(0, j).concat($scope.utensils.slice(j+1, $scope.utensils.length));
                }//if close
              }//for close
            //}//for close
          }//for close
        }//else close
    });//then function close
    }//else close
  }//utens method close
  /*end utensil select dropdown*/

  $scope.utensname=function(test){
    if(test!=null && test!=undefined && test!="" && test.count!=null){
      $scope.ans.utensils_qty=test.count;
    }else{
      $scope.ans.utensils_qty=null;
    }
  }
  
  $http.get(CommonURL+"/api/v1/mealorders?tenant_id="+localStorage.getItem("tenantsid")+"&meal_time="+localStorage.getItem("meal_time")+"&menu_customer_id="+localStorage.getItem("flagsid")+"&meal_restriction_id="+localStorage.getItem("restrict_id"))
    .then(function(response) {
      $rootScope.itemsoftoday = response.data.items; /*food item to set in itemsoftoday*/
      $rootScope.itemscountoption = response.data.data; /*total package to set in toal pack order*/
      $rootScope.menu_customer_id=response.data.menu_customer_id;
      $rootScope.listofmenutoday=[]/*it is used to dropdown food menu*/
      for(var i=0;i<$rootScope.itemsoftoday.length;i++){
        $rootScope.listofmenutoday.push({
          "item_id": $rootScope.itemsoftoday[i].item_id,
          "item_name": $rootScope.itemsoftoday[i].item_name,
          "quantity":$rootScope.itemsoftoday[i].quantity ,
          "uom_id": $rootScope.itemsoftoday[i].uom_id,
          "uom": $rootScope.itemsoftoday[i].uom,
          "totalqty": $rootScope.itemsoftoday[i].totalqty,
          "production_item_id":$rootScope.itemsoftoday[i].production_item_id
        })
      }
    $rootScope.itemsofcount = response.data;/*veg normal package count*/
  });/*to click save and add new button ready to start this function */

      $scope.ans={itemno:"",utensitem:"",foodsitem:"",qty:"",utens_id:""}
      
      $rootScope.items = []; /*over all items to declare and push in this items in array */
      
        $scope.additems=function(){
      
          var index=$scope.listofmenutoday.indexOf($scope.ans.foodsitem)
          if(index > -1){
          if($scope.item_qty > $rootScope.listofmenutoday[index].totalqty && $scope.item_qty != $rootScope.listofmenutoday[index].totalqty){
            alert("Please Enter maximum of < "+$rootScope.listofmenutoday[index].totalqty)
          }
          //console.log($scope.ans.foodsitem)
        else{
         /*var newitem=false;
          for(var i=0; i < $rootScope.items.length;i++){
                if($rootScope.items[i].foodname == $scope.ans.foodsitem.item_name && $rootScope.items[i].category_name == $scope.ans.utensitem.name ){
                  newitem=true;
                  if($rootScope.items[i].no_of_utensil.indexOf($scope.ans.utens_id.utensil_id) == -1){
                    $rootScope.items[i].quantity=($rootScope.items[i].quantity+$scope.item_qty);
                    $rootScope.items[i].no_of_utensil.push($scope.ans.utens_id.utensil_id);
                    $rootScope.items[$rootScope.items.length-1].utensil_count.push({"utensil_id":$scope.ans.utens_id.id})
                  }
                }
          }*/



          /*if(newitem != true){*/
            if($scope.ans.foodsitem !='' && $scope.ans.foodsitem != null ){
              $rootScope.items.push({  
                'quantity':$scope.item_qty,
                'category_name':$scope.ans.utensitem.name,
                'created_by': localStorage.getItem("users_id"),
                'foodname':$scope.ans.foodsitem.item_name,
                'menu_customer_id':$rootScope.menu_customer_id,
                'unit_of_measurement_id':$scope.ans.foodsitem.uom_id, 
                "no_of_utensil":$scope.ans.utens_id.utensil_id,
                "utensil_count":$scope.ans.utens_id.id,
                "count_dummy":$scope.ans.utensils_qty,
                "date": localStorage.getItem("tdydate"),
                "item_id":$scope.ans.foodsitem.item_id,
                "production_item_id":$scope.ans.foodsitem.production_item_id,
                "tenant_id": localStorage.getItem("tenantsid"),
                'status':"Dispatched",
                "meal_time":localStorage.getItem("meal_time"),
                "uom":$scope.ans.foodsitem.uom
              });
             
              /*$rootScope.items[$rootScope.items.length-1].no_of_utensil.push($scope.ans.utens_id.utensil_id)
              $rootScope.items[$rootScope.items.length-1].utensil_count.push({"utensil_id":$scope.ans.utens_id.id})*/
            }

            

         /* }*/

          if($scope.ans.foodsitem !='' && $scope.ans.foodsitem != null ){
            var index=$scope.listofmenutoday.indexOf($scope.ans.foodsitem)
            if($rootScope.listofmenutoday[index].totalqty != $scope.item_qty){
              if(index > -1){
                $rootScope.listofmenutoday[index].totalqty = ($rootScope.listofmenutoday[index].totalqty-$scope.item_qty)
              }
            }
            else{
             $scope.listofmenutoday.splice(index,1);
            }

              $scope.item_qty=0
              $scope.ans.foodsitem='';
              $scope.ans.utensitem='';
              $scope.ans.utens_id=''
              $scope.multi_utensil=false;
              $scope.ans.utensils_qty=0;
              $scope.utensilslength=0;
              
              
            
          }
        }
      }
      }

      $scope.remove = function (index,item) {  /*particular item can removed used itn remove items*/
        var contains = false;
        for(var i = 0; i < $rootScope.listofmenutoday.length; i++) {
          if ($rootScope.listofmenutoday[i].item_name == item.foodname) {
             
              contains = true;
              $rootScope.listofmenutoday[i].totalqty=($rootScope.listofmenutoday[i].totalqty+item.quantity)
              break;
            }
          }

        if (!contains) {
          $rootScope.listofmenutoday.push({
            "item_id": item.item_id,
            "item_name": item.foodname,
            "uom_id":item.unit_of_measurement_id,
            "uom": item.uom,
            "totalqty": item.quantity,
            "production_item_id":item.production_item_id

          })
        }
        /*$scope.item_qty=0
            $scope.ans.foodsitem='';
            $scope.ans.utensitem='';
            $scope.utensilslength=0;*/
        
         $scope.items.splice(index, 1);
      };

  /* });*//*api response closed in function*/

  
  $scope.additem=function(container){  /*over all submit to setup dispatch button*/
  if(container == undefined){
    container =0;
  }

    if(container !=null || container !="" ){
      $ionicPopup.confirm({
            title: "Container Attached:"+container ,
            template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
            buttons: [{
              text: 'Yes',
              type: 'button-positive',
              onTap: function(){$scope.containerdataAdd()}/*if ready to  container Add*/
              },{
              text: 'cancel',
              type: 'button-danger',
              onTap: function(){}
            }]
          });
    }
   

    $scope.containerdataAdd=function(){
      var res = {};
      res = Object.keys($rootScope.items.reduce(function (res, item) {
        if (res[item.foodname]) {}
        else{
          res[item.foodname] = item;
        }
        return res; 
      }, res)).map(function(key) {
        return res[key];
      });
      
      if(res.length != $rootScope.itemsoftoday.length){
        alert("Foods Items Not Dispatch")   //if not food items not Mismatched
      }
      else{
        var data={
          "dispatchs":
            $rootScope.items
        };
        $http({
          method: 'post',
          url: CommonURL+'/api/v1/dispatchs',
          data: data     
        })
        .then(function(response) {
          var putdata={
            "id":localStorage.getItem("flagsid"),
            "delivery_status":"packed"
            };
          $http({
              method: 'put',
              url: CommonURL+'/api/v1/status',
              data: putdata     
            })
            .then(function(response) {
              alert("Successfully");
              $state.go("menup.order");
            })
          }); 
        }
     } 
  }

})/*items controller*/

/*Return controller start*/
.controller('ReturnCtrl', function($scope,$state,$http,$rootScope,$cordovaFileTransfer,$cordovaCamera,$ionicPopup,$controller) {
  $controller('commonCtrl', {$scope: $scope});

  /*Camera to button to click open*/
    $scope.takePicture = function(cam_id) {
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
          $scope.picture = "data:image/jpeg;base64," + imageData;
      });
    }

  /*To select complaint reason */
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

  /*Get menu return food */
  $http.get(CommonURL+"/api/v1/returns?tenant_id="+localStorage.getItem("returntenant_id")+"&meal_time="+localStorage.getItem("returnmealtime")+"&meal_restriction_id="+localStorage.getItem("meal_restriction"))
    .then(function(response) {
        $rootScope.returntoday = response.data.item;
        
   });

  /*Retunsutensils items*/
  $http.get(CommonURL+"/api/v1/dispatch_utensil_ids?tenant_id="+localStorage.getItem("returntenant_id")+"&date="+localStorage.getItem("historydate")+"&meal_time="+localStorage.getItem("returnmealtime")+"&meal_restriction_id="+localStorage.getItem("meal_restriction"))
    .then(function(response) {
      $rootScope.returnutensil = response.data.utensil_id;
      //console.log($rootScope.returnutensil);
  });


  $scope.ans={mealmenu:"",mealsquality:"",uom:"",comment:""}

  /*Retun page to push value in array using  why to return item?*/
  $rootScope.food_returns = [];
  $scope.addNewfood = function () {
    var check=false;
    for(var i=0; i < $rootScope.food_returns.length;i++){
        if($rootScope.food_returns[i].foodmenuitem == $scope.ans.mealmenu.items && $rootScope.food_returns[i].reason_type == $scope.ans.mealsquality.wastefood ){ 
            check=true;
          }
       }
    if(check != true) {
     $rootScope.food_returns.push({    
      'foodmenuitem':$scope.ans.mealmenu.items,
      "normal_menu_id":$scope.ans.mealmenu.id,
      'reason_type':$scope.ans.mealsquality.wastefood,
      'camerapicture':$scope.picture,
      'quantity':$scope.ans.uom,
      'date' :localStorage.getItem("tdydate"),
      'remark': $scope.ans.comment,
      "tenant_id":localStorage.getItem("returntenant_id"),
      "meal_time":localStorage.getItem("returnmealtime")
    
    });
   }
  }
  $scope.ans={utensils:""}
  $rootScope.utensilsreturn = [];
  /*To returneed item of utensils to check*/
  $scope.returnUtnsilsfun=function(){
    var utencheck=false;
    for(var i=0;i<$rootScope.utensilsreturn.length;i++){
      if($rootScope.utensilsreturn[i].id == $scope.ans.utensils.id){
        utencheck = true;
      }
    }
    if(utencheck != true){
      $rootScope.utensilsreturn.push({"id":$scope.ans.utensils.id,"value":$scope.ans.utensils.utensil,"status":"Received"})
    /* var utendata={
              "id":$scope.ans.utensils.id,
              "status":"Received"
            }
            $http({
              method: 'put',
              url: CommonURL+'/api/v1/dispatch_updates',
              data: utendata     
            }).then(function(response) {})*/

    }
  }
  /*return utensils in dropdown*/
  $scope.returnRemove=function(){
    var index=$rootScope.returnutensil.indexOf($scope.ans.utensils)
    $scope.returnutensil.splice(index, 1);
  }

  $scope.utenremove = function (index, n) {
    $rootScope.returnutensil.push({"id": n.id, "utensil": n.value})
    //$rootScope.utensilsreturn.push({"id":n.id,"value":n,"status":"Received"})
    $scope.utensilsreturn.splice(index, 1);
  };

  $scope.remove = function (index) {
    $scope.food_returns.splice(index, 1);
  };
  $scope.returns={answer:""}
  

  /*over all submit in return Item*/

  $scope.reurnfood=function(returlength,utenlength){
    if(returlength >= 1){
      $ionicPopup.confirm({
        title: "Return Items : "+returlength+"<br>"+"Return Utensils : "+utenlength , 
        template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
        buttons: [{
          text: 'Yes',
          type: 'button-positive',
          onTap: function(){
            var data={
              "food_returns":
              $rootScope.food_returns
            };
            $http({
              method: 'post',
              url: CommonURL+'/api/v1/returns',
              data: data     
            }).then(function(response) {
              var putdata={
                "id":localStorage.getItem("returnflagid"),
                "delivery_status":"Completed"
              };
              $http({
                  method: 'put',
                  url: CommonURL+'/api/v1/status',
                  data: putdata     
              }).then(function(response) {

                var utendata={
                'data': $rootScope.utensilsreturn
                }
                $http({
                  method: 'put',
                  url: CommonURL+'/api/v1/dispatch_updates',
                  data: utendata     
                }).then(function(response) {
                  alert("Successfully");
                  $state.go("menup.order");
                })
              })
            }); 
          }
          },{
          text: 'cancel',
          type: 'button-danger',
          onTap: function(){}
        }]
      });
    }
    else{
      $ionicPopup.confirm({
        title: "Return Items : "+returlength+"<br>"+"Return Utensils : "+utenlength ,
        template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
        buttons: [{
          text: 'Yes',
          type: 'button-positive',
          onTap: function(){

            var utendata={
              'data': $rootScope.utensilsreturn
            }
            $http({
              method: 'put',
              url: CommonURL+'/api/v1/dispatch_updates',
              data: utendata     
            }).then(function(response) {



            var putdata={
              "id":localStorage.getItem("returnflagid"),
              "delivery_status":"Completed"
            };
           
            $http({
              method: 'put',
              url: CommonURL+'/api/v1/status',
              data: putdata     
            }).then(function(response) {
              alert("Successfully");
              $state.go("menup.order");
            })
          })
          }
          },{
          text: 'cancel',
          type: 'button-danger',
          onTap: function(){}
        }]
      });
     
    }
  }

})/*Return controller end*/


/*Wastage controller end*/
.controller('WastageCtrl', function($scope,$state,$http,$rootScope,$cordovaFileTransfer,$cordovaCamera,$controller) {
  $controller('commonCtrl', {$scope: $scope});

    $scope.tenantname=localStorage.getItem("tenantname");
    $scope.mealtypename=localStorage.getItem("wastagemealtime");

  /*take picture in camera butoon to wastage food*/
  $scope.takePicture = function(cam_id) {
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
        $rootScope.camera = "data:image/jpeg;base64," + imageData;
    });
  }

  $scope.waste={wasteqty:"",totalqty:"",comment:""}
  
  /*over all wastage submit */
  $scope.wastage=function(){
    var data=
    {
      "date":localStorage.getItem("tdydate"), 
      "meal_time": localStorage.getItem("wastagemealtime"), 
      "tenant_id": localStorage.getItem("wastetenant_id"), 
      "total_qty": $scope.waste.totalqty, 
      "wastage_quantity":$scope.waste.wasteqty , 
      "image": $rootScope.camera, 
      "remark":$scope.waste.comment,
      "unit_of_measurement_id":"2" 
    };
    $http({
      method: 'post',
      url: CommonURL+'/api/v1/wastages',
      data: data     
      }).then(function(response) {
        $rootScope.camera="";
        alert("Successfully")
        $state.go("menup.order");
    }); 
  }
   
})/*Wastage end controller*/

/*History controller to start*/

.controller('HistoryCtrl', function($scope,$state,$http,$filter,$ionicModal,ionicDatePicker,$timeout,$controller) {
  $controller('commonCtrl', {$scope: $scope});

  var newdate = new Date();
  $scope.datesnow=newdate;
  $scope.datenow = $filter('date')(newdate, "dd-MM-yyyy");
  $scope.datee = $filter('date')(newdate, "dd-MMMM-yyyy");
  $scope.day = $filter('date')(newdate, "EEEE");  
  
  $scope.doRefresh=function(){
 
    $http.get(CommonURL+"/api/v1/todaymenus?type="+ $scope.datenow+"&tenant_id="+localStorage.getItem("tenantids"))
        .then(function(response) {
            $scope.todayorders = response.data.order;/*to list value in orders in History Page*/
    });

    $timeout( function() {
     $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);

  }

  $http.get(CommonURL+"/api/v1/todaymenus?type="+ $scope.datenow+"&tenant_id="+localStorage.getItem("tenantids"))
        .then(function(response) {
            $scope.todayorders = response.data.order;/*to list value in orders in History Page*/
    });

        
    /*date  picker callback option*/
    var ipObj1 = {
      callback: function (val) { 
        $scope.Historydate= new Date(val);
        $scope.historydatenow = $filter('date')($scope.Historydate, "dd-MM-yyyy");
        $scope.histrydatenow = $filter('date')($scope.Historydate, "dd-MMMM-yyyy");
        $scope.histrydaynow = $filter('date')($scope.Historydate, "EEEE");        
        $http.get(CommonURL+"/api/v1/todaymenus?type="+$scope.historydatenow+"&tenant_id="+localStorage.getItem("tenantids"))
        .then(function(response) {
            $scope.todayorders = response.data.order;
         });
        
      },
      
      from: new Date(2012, 1, 1), //Optional
      to: new Date(), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };
    /*check history in today to previous year*/

    /*Open date picker button History page*/
    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
      
    };
    /*end date picker*/


    /*it is used to open popup model in history page */
    $scope.historytag = function(Historydate,mealstime,tenant_id) {
      dates=$filter('date')(Historydate, "dd-MM-yyyy");
      $ionicModal.fromTemplateUrl('templates/historydata.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $http.get(CommonURL+"/api/v1/histories?date="+dates+"&tenant_id="+tenant_id+"&meal_time="+mealstime+"&history=true")
        .then(function(response) {
          $scope.historydatas = response.data.history.dispatch;
          $scope.historyreturn = response.data.history.FoodReturn;
        });
        $scope.modal.show();
      }); 
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };
 })/*close controller History*/


/*unique data to check filter items over all pages dropdown and ng-repeat to use unique items*/
.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];
      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
   };
})

/*.controller('MainCtrl', function($scope, $timeout, $filter) { 
  
  
  
  $scope.groups = [
    {Id: 1, Name: "Admin" },
    {Id: 2, Name: "Developers"},
    {Id: 3, Name: "Testers"},
    {Id: 4, Name: "Users"}
  ];
  
  $scope.getOptionsSelected = function(options, valueProperty, selectedProperty){
    console.log(valueProperty)
    var optionsSelected = $filter('filter')(options, function(option) {return option[selectedProperty] == true; });
    return optionsSelected.map(function(group){ return group[valueProperty]; }).join(", ");
  };
})*/

.directive('ionMultipleSelect', ['$ionicModal', '$ionicGesture', function ($ionicModal, $ionicGesture) {
  return {
    restrict: 'E',
    scope: {
      options : "="
    },
    controller: function ($scope, $element, $attrs) {
      $scope.multipleSelect = {
        title:            $attrs.title || "Select Options",
        tempOptions:      [],
        keyProperty:      $attrs.keyProperty || "id",
        valueProperty:    $attrs.valueProperty || "value",
        selectedProperty: $attrs.selectedProperty || "selected",
        templateUrl:      $attrs.templateUrl || 'templates/dropdown.html',
        renderCheckbox:   $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
        animation:        $attrs.animation || 'slide-in-up'
      };

      $scope.OpenModalFromTemplate = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: $scope.multipleSelect.animation
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };
      
      $ionicGesture.on('tap', function (e) {
       $scope.multipleSelect.tempOptions = $scope.options.map(function(option){
         var tempOption = { };
         tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
         tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
         tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];
         
         return tempOption;
       });
        $scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
      }, $element);
      
      $scope.saveOptions = function(){
       
        for(var i = 0; i < $scope.multipleSelect.tempOptions.length; i++){
          var tempOption = $scope.multipleSelect.tempOptions[i];
          for(var j = 0; j < $scope.options.length; j++){
            var option = $scope.options[j];
            if(tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]){
              option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
              break;
            }
          }
        }
        $scope.closeModal();
      };
      
      $scope.closeModal = function () {
        $scope.modal.remove();
      };
      $scope.$on('$destroy', function () {
          if ($scope.modal){
              $scope.modal.remove();
          }
      });
    }
  };
}])


.controller('EditCtrl', function($scope,$rootScope,$ionicPopup,$state,$http,$timeout, $filter,$controller) {
  $controller('commonCtrl', {$scope: $scope});
    


    $scope.tenantname=localStorage.getItem("tenantname");
    $scope.mealtypename=localStorage.getItem("meal_time");
    var newdate = new Date();
    $scope.datee = $filter('date')(newdate, "dd-MMMM-yyyy");
    $scope.day = $filter('date')(newdate, "EEEE");
/*if used food select in dropdown in items of today page  function*/
 

  $scope.logdata = function(activecla){

    if(activecla == null || activecla == ''){
      $scope.itemname = '';
      $scope.item_qty =null;
    }
    else{
      $scope.itemname=activecla.item_name;
      $scope.itemid=activecla.item_id;
      $scope.item_qty=activecla.totalqty;
      $rootScope.newitem_qty=activecla.totalqty;
    }
  }

  /*This api used utensils item show in drop down*/
  $http.get(CommonURL+"/api/v1/utensilsnames")
    .then(function(response) {
        $scope.utensilsitems = response.data;
  });



  /*if you send utensils id get utens number every ustensid to display in next dropdown */
  $scope.utens=function(utensitem){
    if(utensitem == null){
      $scope.utensilslength = 0;
      $scope.multi_utensil=false;
    }
    else{
    $http.get(CommonURL+"/api/v1/utensils?id="+utensitem.id)
      .then(function(response) {
        if(response.data == null){
          $scope.utensilslength = 0;
          $scope.utensils = null;
          $scope.multi_utensil=false;
        }
        else{
          $scope.utensilslength = 1;
          $scope.utensils = response.data.namelist;
          $scope.utensils_count = response.data.count;
          
          if($scope.ans.utensitem.status=='Multiple'){
            $scope.multi_utensil=true; 
          }else{
           $scope.multi_utensil=false;  
          }  
            
          for(var k=0;k<$rootScope.items.length;k++){
            /*for (var i = 0; i<$rootScope.items[k].no_of_utensil.length; i++) {*/
              for (var j = 0; j<$scope.utensils.length; j++) {
                if ($rootScope.items[k].no_of_utensil==$scope.utensils[j].utensil_id) {
                  $scope.utensils = $scope.utensils.slice(0, j).concat($scope.utensils.slice(j+1, $scope.utensils.length));
                }//if close
              }//for close
            //}//for close
          }//for close
        }//else close
    });//then function close
    }//else close
  }//utens method close
  /*end utensil select dropdown*/
  
  $http.get(CommonURL+"/api/v1/redispatchs?tenant_id="+localStorage.getItem("tenantsid")+"&meal_time="+localStorage.getItem("meal_time")+"&menu_customer_id="+localStorage.getItem("flagsid"))
    .then(function(response) {
      $rootScope.itemsoftoday = response.data.items; /*food item to set in itemsoftoday*/
      $rootScope.itemscountoption = response.data.data; /*total package to set in toal pack order*/
      $scope.menu_customer_id=response.data.menu_customer_id;
      $rootScope.listofmenutoday=[]/*it is used to dropdown food menu*/
      
      for(var i=0;i<$rootScope.itemsoftoday.length;i++){
        $rootScope.listofmenutoday.push({
          "item_id": $rootScope.itemsoftoday[i].item_id,
          "item_name": $rootScope.itemsoftoday[i].item_name,
          "quantity":$rootScope.itemsoftoday[i].quantity ,
          "uom_id": $rootScope.itemsoftoday[i].uom_id,
          "uom": $rootScope.itemsoftoday[i].uom,
          "totalqty": $rootScope.itemsoftoday[i].totalqty,
          "production_item_id":$rootScope.itemsoftoday[i].production_item_id
        })
      }
    $rootScope.itemsofcount = response.data;/*veg normal package count*/
  });/*to click save and add new button ready to start this function */

      $scope.ans={itemno:"",utensitem:"",foodsitem:"",qty:"",utens_id:""}
      
      $rootScope.items = []; /*over all items to declare and push in this items in array */
      
        $scope.additems=function(){
         
          var index=$scope.listofmenutoday.indexOf($scope.ans.foodsitem)
          if($scope.item_qty > $rootScope.listofmenutoday[index].totalqty && $scope.item_qty != $rootScope.listofmenutoday[index].totalqty){
            alert("Please Enter maximum of < "+$rootScope.listofmenutoday[index].totalqty)
          }
          //console.log($scope.ans.foodsitem)
        else{
    
          /*if(newitem != true){*/
            if($scope.ans.foodsitem !='' && $scope.ans.foodsitem != null ){
              $rootScope.items.push({  
                'quantity':$scope.item_qty,
                'category_name':$scope.ans.utensitem.name,
                'created_by': localStorage.getItem("users_id"),
                'foodname':$scope.ans.foodsitem.item_name,
                'menu_customer_id':$scope.menu_customer_id,
                'unit_of_measurement_id':$scope.ans.foodsitem.uom_id, 
                "no_of_utensil":$scope.ans.utens_id.utensil_id,
                "utensil_count":$scope.ans.utens_id.id,
                "count_dummy":$scope.ans.utensils_qty,
                "date": localStorage.getItem("tdydate"),
                "item_id":$scope.ans.foodsitem.item_id,
                "production_item_id":$scope.ans.foodsitem.production_item_id,
                "tenant_id": localStorage.getItem("tenantsid"),
                'status':"Dispatched",
                "meal_time":localStorage.getItem("meal_time"),
                "dispatch_type":"redispatch",
                "uom":$scope.ans.foodsitem.uom
              });
             
            }

            

         /* }*/

          if($scope.ans.foodsitem !='' && $scope.ans.foodsitem != null ){
            var index=$scope.listofmenutoday.indexOf($scope.ans.foodsitem)
            if($rootScope.listofmenutoday[index].totalqty != $scope.item_qty){
              if(index > -1){
                $rootScope.listofmenutoday[index].totalqty = ($rootScope.listofmenutoday[index].totalqty-$scope.item_qty)
              }
            }
            else{
             $scope.listofmenutoday.splice(index,1);
            }

              $scope.item_qty=0
              $scope.ans.foodsitem='';
              $scope.ans.utensitem='';
              $scope.ans.utens_id=''
              $scope.multi_utensil=false;
              $scope.ans.utensils_qty=0;
              $scope.utensilslength=0;
               
            
          }
        }
      }

      $scope.utensname=function(test){
       if(test!=null && test!=undefined && test!="" && test.count!=null){
         $scope.ans.utensils_qty=test.count;
       }else{
         $scope.ans.utensils_qty=null;
       }
      }

      $scope.remove = function (index,item) {  /*particular item can removed used itn remove items*/
        var contains = false;
        for(var i = 0; i < $rootScope.listofmenutoday.length; i++) {
          if ($rootScope.listofmenutoday[i].item_name == item.foodname) {
             
              contains = true;
              $rootScope.listofmenutoday[i].totalqty=($rootScope.listofmenutoday[i].totalqty+item.quantity)
              break;
            }
          }

        if (!contains) {
          $rootScope.listofmenutoday.push({
            "item_id": item.item_id,
            "item_name": item.foodname,
            "uom_id":item.unit_of_measurement_id,
            "uom": item.uom,
            "totalqty": item.quantity,
            "production_item_id":item.production_item_id
          })
        }
        $scope.item_qty=0
        $scope.ans.foodsitem='';
        $scope.ans.utensitem='';
        $scope.ans.utens_id='';
        $scope.ans.utensils_qty=0;
        $scope.utensilslength=0;
        $scope.multi_utensil=false;
       
         $scope.items.splice(index, 1);
      };
  
  $scope.additem=function(container){  /*over all submit to setup dispatch button*/
  if(container == undefined){
    container =0;
  }

    if(container !=null || container !="" ){
      $ionicPopup.confirm({
            title: "Container Attached:"+container ,
            template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
            buttons: [{
              text: 'Yes',
              type: 'button-positive',
              onTap: function(){$scope.containerdataAdd()}/*if ready to  container Add*/
              },{
              text: 'cancel',
              type: 'button-danger',
              onTap: function(){}
            }]
          });
    }

    $scope.containerdataAdd=function(){
      var res = {};
      res = Object.keys($rootScope.items.reduce(function (res, item) {
        if (res[item.foodname]) {}
        else{
          res[item.foodname] = item;
        }
        return res; 
      }, res)).map(function(key) {
        return res[key];
      });
      
      if(res.length != $rootScope.itemsoftoday.length){
        alert("Foods Items Not Dispatch")  //if not food items not Mismatched
      }
      else{
        var data={
          "dispatchs":
            $rootScope.items
        };
        $http({
          method: 'post',
          url: CommonURL+'/api/v1/dispatchs',
          data: data     
        })
        .then(function(response) {
          var putdata={
            "id":localStorage.getItem("flagsid"),
            "delivery_status":"packed"
            };
          $http({
              method: 'put',
              url: CommonURL+'/api/v1/status',
              data: putdata     
            })
            .then(function(response) {
              alert("Successfully");
              $state.go("menup.order");
            })
          }); 
        }
     } 
  }

})/*items controller*/

