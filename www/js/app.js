// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


angular.module('starter', ['ionic', 'starter.controllers','starter.dispatch','starter.deliveries','ngCordova','starter.services','ionic-ratings','ionic-datepicker','ngMap','ngIdle'])





.run(function($ionicPlatform,$ionicPopup,$ionicHistory,$rootScope,$http,$state) {

  /*$ionicPlatform.ready(function() {
    TestFairy.begin("a4553c4836ba229f49684f69ce16b74c8e4b5066"); //taken from https://app.testfairy.com/settings/#apptoken 
  });*/

 $ionicPlatform.ready(function() {

   /*var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("98c2835b-8c27-45ef-8eb4-8418f793e88e")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();*/
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    /*document.addEventListener("deviceready", function() {
    hockeyapp.start(success, error, "d47a5740d9f7494c846806964943b019");
    
    function error(error) {
     console.log(error);
    }
    
    function success(status) {
     console.log(status);
    }
    
   }, false);*/
    
  });


$ionicPlatform.registerBackButtonAction(function(e) {
 e.preventDefault();
 function showConfirm() {
  var confirmPopup = $ionicPopup.show({
   title : 'Habitos Says :-)',
   template : 'Are you sure want to exit ?',
   buttons : [{
    text : 'Cancel',
    type : 'button-positive',
   }, {
    text : 'Ok',
    type : 'button-danger',
    onTap : function() {
     ionic.Platform.exitApp();
    }
   }]
  });
 };

   if($state.current.name=='login' || $state.current.name=='app.home' || $state.current.name=='navihome' || $state.current.name == 'menup.order'){
   // navigator.app.exitApp(); //<-- remove this line to disable the exit
   showConfirm();
  }
  else {
    navigator.app.backHistory();
  }
}, 100);


 
 
  
})

.config(function(IdleProvider, KeepaliveProvider) {
      IdleProvider.idle(600);
      IdleProvider.timeout(5);
      KeepaliveProvider.interval(10);
 })

.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(1947, 8, 1),
      to: new Date(2028, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

/*.config(function(multiselectProvider) {
    multiselectProvider.setTemplateUrl('lib/ionic-multiselect/dist/templates/item-template.html');
    multiselectProvider.setModalTemplateUrl('lib/ionic-multiselect/dist/templates/modal-template.html');
})
*/
.config(function($stateProvider, $ionicConfigProvider, $urlRouterProvider) {

$ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

  .state('menup', {
      url: '/menup',
      abstract: true,
      templateUrl: 'templates/menu1.html'
    })


  .state('login', {
     url: '/login',
     templateUrl: 'templates/login.html'
    })

   .state('navihome', {
     url: '/navihome',
     templateUrl: 'templates/navihome.html'
    })

   .state('navigate', {
     url: '/navigate',
     templateUrl: 'templates/navigate.html'
    })



   .state('app.home', {
     url: '/home',
     views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
     }
    })

   .state('menup.order', {
     url: '/order',
     views: {
      'menuscontent': {
        templateUrl: 'templates/order.html'
      }
     }
    })

   .state('menup.itemsofday', {
     url: '/itemsofday',
     views: {
      'menuscontent': {
        templateUrl: 'templates/itemsofday.html'
      }
     }
    })

    .state('menup.temperory', {
     url: '/temperory',
     views: {
      'menuscontent': {
        templateUrl: 'templates/temperory.html'
      }
     }
    })

   .state('menup.return', {
     url: '/return',
     views: {
      'menuscontent': {
        templateUrl: 'templates/return.html'
      }
     }
    })

   .state('menup.Editdispatch', {
     url: '/Editdispatch',
     views: {
      'menuscontent': {
        templateUrl: 'templates/Editdispatch.html'
      }
     }
    })
   

   .state('menup.wastage', {
     url: '/wastage',
     views: {
      'menuscontent': {
       templateUrl: 'templates/wastage.html'
      }
     }
    })

   .state('menup.history', {
     url: '/history',
     views: {
      'menuscontent': {
       templateUrl: 'templates/history.html'
      }
     }
    })


  .state('tab', {
    url: '/tab',

     templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

       
  

  .state('tab.delivery', {
    url: '/delivery',
    views: {
      'delivery': {
        templateUrl: 'templates/delivery.html'
      }
    }
  })

  .state('tab.service', {
      url: '/service',
      views: {
        'service': {
          templateUrl: 'templates/service.html'
        }
      }
    })

  
  .state('tab.food', {
    url: '/food',
    views: {
      'food': {
        templateUrl: 'templates/food.html'
      }
    }
  })

  .state('feedback', {
     url: '/feedback',
     templateUrl: 'templates/feedback.html'
    });

  // if none of the above states are matched, use this as the fallback
  if (localStorage.getItem("role_id") == 5 ){
    $urlRouterProvider.otherwise('app/home');
  }
  else if(localStorage.getItem("role_id") == 6 ){
    $urlRouterProvider.otherwise('menup/order');
  }
  else if(localStorage.getItem("role_id") == 11 ){
    $urlRouterProvider.otherwise('/navihome'); 
  }
  else{
   $urlRouterProvider.otherwise('/login'); 
  }

})

.controller("commonCtrl", function($scope,Idle,$rootScope,$http,$state,$timeout,$ionicPopup) {
    Idle.watch();
    $scope.$on('IdleStart', function(){});
    $scope.$on('IdleEnd', function(){});
    $scope.$on('IdleTimeout', function() {
      /*$rootScope.popup = $ionicPopup.show({
        title: "Do you want to Logout?",
        template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
        function(){*/
          //alert("Session Timeout")
            $scope.stop();

        /*}
      })*/

    var myPopup = $ionicPopup.show({
      title: 'Session Timeout',
      scope: $scope,
    });
     $timeout(function() {
      
      myPopup.close(); //close the popup after 3 seconds for some reason
      $scope.modal.hide();
    }, 1000);
      
    }); 

      $scope.stop = function() {
        //$rootScope.popup.close()

        Idle.unwatch();
        $scope.$apply();
        var putdata={
                 "id":localStorage.getItem("users_id"),
              };
        $http({
          method: 'put',
          url: CommonURL+'/api/v1/dispatch_logout',
          data: putdata     
        }).success(function(data) {
          localStorage.clear();
          $scope.user="";
          $rootScope.logdata="";
          $state.go("login")
        })
      };       
  })

//var CommonURL="http://api.learnstein.com:81";
//var CommonURL="http://api.texparts.in:81"
//var CommonURL="http://192.168.1.18:3000";  
var CommonURL="http://192.168.1.72:3005"; 
//var CommonURL="http://13.126.175.143:3000";
//var CommonURL="http://115.111.129.98:6002";
//var CommonURL="http://api.idlidabba.com"