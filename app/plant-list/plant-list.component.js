'use strict';

const WATERING_TIME = 10000;
const REST_TIME = 30000;
const NO_WATER_TIME = 21600000; //6 hours

angular.
  module('plantList').
  component('plantList', {
    templateUrl: 'plant-list/plant-list.template.html',
    controller: ['$http', '$timeout', function PhoneListController($http, $timeout) {
        self = this;

        self.setStatus = function(index, val){
            $timeout(function(){
              self.plants[index].status = val;
            }, WATERING_TIME);
        };

        self.EnableWater = function(index){
          $timeout(function(){
            self.plants[index].canWater = true;
          }, REST_TIME + WATERING_TIME)
        }

        self.watering = function(index){

          $timeout.cancel(self.plants[index].lastWateredTimer);
          self.plants[index].status = "Getting water";
          self.plants[index].canWater = false;
          self.setStatus(index, "Normal");
          self.EnableWater(index);

          if(self.plants[index].imgUrl == self.plants[index].imgNeedsWater){
              self.plants[index].imgUrl = self.plants[index].imgNormal;
            }

          self.setLastWateredTimer(index);
        };

        self.setLastWateredTimer = function(index){
          self.plants[index].lastWateredTimer = $timeout(function(){
              self.plants[index].imgUrl = self.plants[index].imgNeedsWater;
              self.plants[index].status = "needs water";
              }, NO_WATER_TIME);
        };

        $http.get('plants/plants.json').then(function(response){
          self.plants = response.data;
          var i;
          for(i=0;i < self.plants.length; i++){
            self.plants[i].imgUrl = self.plants[i].imgNormal;
            self.setLastWateredTimer(i);
          }
        });
      }]
  });
