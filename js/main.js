/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('insightPlayer', ['ngRoute']);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    //.when("/", {templateUrl: "partials/dashboard.html", controller: "PageCtrl"})
    .when("/", {templateUrl: "partials/tables.html", controller: "JugadorCtrl"})
    //.when("/", {templateUrl: "/login.html"})
    // Pages
    .when("/blank", {templateUrl: "partials/blank.html", controller: "PageCtrl"})
    .when("/buttons", {templateUrl: "partials/buttons.html", controller: "PageCtrl"})
    .when("/flot", {templateUrl: "partials/flot.html", controller: "PageCtrl"})
    .when("/forms", {templateUrl: "partials/forms.html", controller: "PageCtrl"})
    .when("/grid", {templateUrl: "partials/grid.html", controller: "PageCtrl"})
    .when("/morris", {templateUrl: "partials/morris.html", controller: "PageCtrl"})
    .when("/notifications", {templateUrl: "partials/notifications.html", controller: "PageCtrl"})
    .when("/panels-wells", {templateUrl: "partials/panels-wells.html", controller: "PageCtrl"})
    .when("/typography", {templateUrl: "partials/typography.html", controller: "PageCtrl"})

    .when("/tables", {templateUrl: "partials/tables.html", controller: "JugadorCtrl"})
    .when("/categorias", {templateUrl: "partials/categorias.html", controller: "CategoriasCtrl"})
    .when("/profile", {templateUrl: "partials/playerProfile.html", controller: "ProfileCtrl"})
    .when("/editPlayer", {templateUrl: "partials/editPlayer.html", controller: "ProfileCtrl"})
    .when("/createPlayer", {templateUrl: "partials/createPlayer.html", controller: "JugadorCtrl"})
    .when("/medicalHistory", {templateUrl: "partials/medicalHistory.html", controller: "ProfileCtrl"})
    .when("/addWorkoutSession",{templateUrl: "partials/addWorkoutSession.html", controller: "WorkoutCtrl"})
    .when("/analytics", {templateUrl: "partials/analytics.html", controller: "AnalyticsCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/*CONFIG*/

app.run(function ($rootScope, $location,$route, $timeout) {

    $rootScope.config = {};
    $rootScope.config.app_url = $location.url();
    $rootScope.config.app_path = $location.path();
    $rootScope.layout = {};
    $rootScope.layout.loading = false;

    $rootScope.$on('$routeChangeStart', function () {
        $timeout(function(){
          $rootScope.layout.loading = true;          
          angular.element('#mydiv').show();
        });
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        console.log('$routeChangeSuccess');
        //hide loading gif
        $timeout(function(){
          $rootScope.layout.loading = false;
          angular.element('#mydiv').hide();
        }, 200);
    });
    $rootScope.$on('$routeChangeError', function () {
        //hide loading gif
        $rootScope.layout.loading = false;
        angular.element('#mydiv').hide();
    });
});

/**
 * Controls all other Pages
 */


app.controller('ProfileCtrl',['$scope', '$location','JugadoresService', function($scope, $location,JugadoresService) {
    console.log("ProfileCtrl! reporting for duty.");

    var editMode = false;
    $scope.posiciones = ['1ra Linea', '2da Linea', '3ra Linea', 'Medioscrum', 'Apertura', 'Centro', 'Wing', 'Fullback'];

    $scope.selection = [];

    $scope.historia = { fecha : new Date() };
    $scope.buttonLabel = "Registrar";
    $scope.toggleSelection = function toggleSelection(posicion) {
        var idx = $scope.selection.indexOf(posicion);
        // is currently selected
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
        // is newly selected
        else {
          $scope.selection.push(posicion);
        }
    };

    $scope.addMedicalHistoryRecord = function(){
        if(!editMode){
            if(!$scope.jugador.historiaMedica){
            $scope.jugador.historiaMedica = [];
            }
            $scope.jugador.historiaMedica.push($scope.historia);
        }
        $scope.editarMedicalHistory($scope.jugador._id);
        $scope.historia = { fecha : new Date() };
        editMode = false;
        $scope.buttonLabel = "Registrar";
    }

    $scope.loadMedicalHistoryRecord = function(historia){
        $scope.buttonLabel = "Guardar";
        $scope.historia = historia;
        $scope.historia.fecha = new Date(historia.fecha);
        editMode = true;
    }

    $scope.fichaMedicaVencida = function(fechaVencimiento){
        var today = new Date();
        var fVencimiento = new Date(fechaVencimiento);
        return fVencimiento.getTime() < today.getTime();
    };

    JugadoresService.obtJugador().then(function(response){
        $scope.jugador = response;
        $scope.jugador.fechaNacimiento = new Date($scope.jugador.fechaNacimiento);
        $scope.jugador.fechaVencimientoFM = new Date($scope.jugador.fechaVencimientoFM);
        $scope.selection = $scope.jugador.posicion;
    });

    $scope.eliminarJugador = function (id) {
        JugadoresService.deleteJugador(id).then(function(response){
            $location.path('/tables');
        });
    };

    $scope.editarJugador = function (id) {
        JugadoresService.editJugador(id,$scope.jugador).then(function(response){
            $location.path('/profile');
        });
    };

    $scope.editarMedicalHistory = function (id) {
        JugadoresService.editJugador(id,$scope.jugador).then(function(response){
            
        });
    };

    $scope.goToMedicalHistory = function(){
        $location.path('/medicalHistory');
    };

    $scope.goToProfile = function(){
        $location.path('/profile');
    };

}]);

app.service('JugadoresService', ['$http', function ($http) {
    
    var jugador = {};

    this.obtJugador = function(){
        return jugador;
    };

    this.addJugador = function (player) {
        var promise = $http.post('/jugador',player).then(function(response){
            return response.data;
        });
        return promise;

    };

    this.deleteJugador = function (id) {
        var promise = $http.delete('/jugador/' + id).then(function(response){
            return response.data;
        });
        return promise;
    };

    this.getJugador = function (id) {
        var promise = $http.get('/jugador/' + id).then(function(response){
            return response.data;
        });
        jugador = promise;
        return promise;
    };
    
    this.list = function () {
        var promise = $http.get('/jugador').then(function(response) {
            return response.data;
        });
        return promise;
    };

    this.getJugadoresPorFecha = function (fechaDesde, fechaHasta) {
        var promise = $http.get('/jugador/' + fechaDesde + '/' + fechaHasta).then(function(response) {
            return response.data;
        });
        return promise;
    };

    this.getSocios = function () {
        var promise = $http.get('/jugadorSocios').then(function(response) {
            return response.data;
        });
        return promise;
    };

    this.editJugador = function(id,player) {
        var promise = $http.put('/jugador/' + id, player).then(function(response){
            return response.data;
        });
        jugador = promise;
        return promise;
    };
}]);

app.controller('JugadorCtrl', ['$scope','$location', 'JugadoresService', function($scope,$location, JugadoresService) {
    console.log("JugadorCtrl in action!");

    $scope.posiciones = ['1ra Linea', '2da Linea', '3ra Linea', 'Medioscrum', 'Apertura', 'Centro', 'Wing', 'Fullback'];

    $scope.selection = [];
    $scope.loading = false;

    $scope.toggleSelection = function toggleSelection(posicion) {
        var idx = $scope.selection.indexOf(posicion);
        // is currently selected
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
        // is newly selected
        else {
          $scope.selection.push(posicion);
        }
    };

    $scope.fichaMedicaVencida = function(fechaVencimiento){
        var today = new Date();
        var fVencimiento = new Date(fechaVencimiento);
        console.log(fVencimiento);
        return fVencimiento.getTime() < today.getTime();
    };
    
    var refresh = function (argument) {
        JugadoresService.list().then(function(response){
            $scope.jugadores = response;
        });
    };
    refresh();
    $scope.addJugador = function () {
        if ($scope.registrationForm.$valid) {
            $scope.jugador.posicion = $scope.selection;
            console.log($scope.jugador);
            JugadoresService.addJugador($scope.jugador).then(function(response){
                $scope.jugador = "";
                $scope.selection = [];
                $location.path('/tables');
                //refresh();
            });
        }
    };

    /*$scope.eliminarJugador = function (id) {
        console.log(id);
        JugadoresService.deleteJugador(id).then(function(response){
            refresh();
        });
    };*/

    $scope.verJugador = function (id) {
        console.log(id);
        JugadoresService.getJugador(id).then(function(response){
            $location.path('/profile');
        });
    };

    $scope.goToCreatePlayer = function(){
        $location.path('/createPlayer');
    };   
    
}]);

app.service('CategoriasService', ['$http', function ($http) {

    this.list = function () {
        var promise = $http.get('/categoria').then(function(response) {
            return response.data;
        });
        return promise;
    };

    this.addCategoria = function (categoria) {
        var promise = $http.post('/categoria',categoria).then(function(response){
            return response.data;
        });
        return promise;
    };

    this.deleteCategoria = function (id) {
        var promise = $http.delete('/categoria/' + id).then(function(response){
            return response.data;
        });
        return promise;
    };



}]);

app.controller('CategoriasCtrl', ['$scope','$location', 'JugadoresService','CategoriasService', function($scope,$location, JugadoresService, CategoriasService) {
    console.log("CategoriasCtrl in action!");
    $scope.tab = 0;

    $scope.jugadores = [];

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };

    var cargarCategorias = function () {
        CategoriasService.list().then(function(response){
            $scope.categorias = response;
        }).then(function(){
            for (var i = 0; i < $scope.categorias.length; i++) {
                JugadoresService.getJugadoresPorFecha($scope.categorias[i].fechaDesde,$scope.categorias[i].fechaHasta).then(function(response){
                    $scope.jugadores.push(response);
                });  
            };
        });
    };

    cargarCategorias();


    $scope.verJugador = function (id) {
        console.log(id);
        JugadoresService.getJugador(id).then(function(response){
            $location.path('/profile');
        });
    };

    $scope.goToCreatePlayer = function(){
        $location.path('/createPlayer');
    };

    $scope.eliminarCategoria = function (id) {
        CategoriasService.deleteCategoria(id).then(function(response){
            cargarCategorias();
            $scope.tab = 0;
        });
    };

    $scope.addCategoria = function () {
        console.log($scope.categoria);
        CategoriasService.addCategoria($scope.categoria).then(function(response){
            $scope.caregoria = "";
            cargarCategorias();
            //refresh();
        });
    };
    
}]);


app.controller('AnalyticsCtrl',['$scope','JugadoresService', function($scope, JugadoresService) {
    console.log("AnalyticsCtrl! reporting for duty.");

    /*
    var getSocios = function () {
        JugadoresService.getSocios().then(function(response){
            $scope.socios = response.length;
        });
    };

    getSocios();

    getSocios(true).then(function(response) { $scope.socios = response; });
    getSocios(false).then(function(response) { $scope.noSocios = response; });*/

    $scope.mensaje = "(datos NO reales, todavia en construccion)";
    $scope.socios = 9;
    $scope.nosocios = 3;

    Morris.Donut({
        element: 'morris-donut-chart',
        parseTime : false,
        data: [{
            label: "Socios",
            value: $scope.socios
        }, {
            label: "No socios",
            value: $scope.nosocios
        }],
        colors: ["#3A89C9", "#F26C4F"],
        resize: true
    });

}]);

app.controller('WorkoutCtrl',['$scope','$location','WorkoutService',function($scope,$location,WorkoutService){
    
    $scope.ejercicios=['Pecho Plano', 'Subidas Frontales','Dominadas', 'Press de Hombros','Sentadillas','Tirones con Barra','Tirones con Manc.','Despegues','Peso Muerto'];
    $scope.ejercicio = {};
    $scope.workout = {
        nombre:"Semana 1",
        ejercicios: []
    };
    $scope.toggleSelection = function toggleSelection(ejercicio) {
        var idx = $scope.ejercicio.indexOf(ejercicio);
        // is currently selected
        if (idx > -1) {
          $scope.ejercicio.splice(idx, 1);
        }
        // is newly selected
        else {
          $scope.ejercicio.push(ejercicio);
        }
    };

    $scope.addEjercicio = function(){
        $scope.workout.ejercicios.push($scope.ejercicio);
        $scope.ejercicio = {};
    };

    $scope.saveWorkout = function(){
        WorkoutService.addWorkoutSession($scope.workout);
        //Redirigir pagina principal
    };



}]);

app.service('WorkoutService', ['$http', function ($http) {
    
    var wosession = {};

   /* this.obtJugador = function(){
        return jugador;
    };*/

    this.addWorkoutSession = function (woSession) {
        var promise = $http.post('/workout',woSession).then(function(response){
            return response.data;
        });
        return promise;

    };

    this.getWOSession = function (id) {
        var promise = $http.get('/workout/' + id).then(function(response){
            return response.data;
        });
        wosession = promise;
        return promise;
    };

   /* this.deleteJugador = function (id) {
        var promise = $http.delete('/jugador/' + id).then(function(response){
            return response.data;
        });
        return promise;
    };*/

 
    
    this.list = function () {
        var promise = $http.get('/workout').then(function(response) {
            return response.data;
        });
        return promise;
    };

    this.getJugadoresPorFecha = function (fechaDesde, fechaHasta) {
        var promise = $http.get('/workout/' + fechaDesde + '/' + fechaHasta).then(function(response) {
            return response.data;
        });
        return promise;
    };

    this.getSocios = function () {
        var promise = $http.get('/workout').then(function(response) {
            return response.data;
        });
        return promise;
    };

    this.editJugador = function(id,player) {
        var promise = $http.put('/workout/' + id, player).then(function(response){
            return response.data;
        });
        jugador = promise;
        return promise;
    };
}]);