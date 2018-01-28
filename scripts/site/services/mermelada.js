'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.service:MermeladaService
 * @description
 * # MermeladaService
 * Service of the anyandgoApp
 */
angular.module('anyandgoApp')
  .factory('MermeladaService', function ($http) {
     var req = function(method, path, data){
        return $http({
            method: method,
            url: '.'+path,
            data: data
//        }).then(function(res){
//            return res.data;
        });
     }
     
     return {
         get: function(path, data){
             return req('GET', path, data);
         },
         post: function(path, data){
             return req('POST', path, data);
         },
         put: function(path, data){
             return req('PUT', path, data);
         },
         delete: function(path, data){
             return req('DELETE', path, data);
         },
         parseClass: function(mcode){
             var toParse = mcode.split("\n")
             var obj = {
               class_title : "",
               methods: [],
               statics: [],
               attrs: []    
             };
             angular.forEach(toParse, function(line, i){
               var line_split = line.split(" ");

               if(line.match(/^C .*/)) {
                 obj.class_title = line_split[1]
               } 

               if(line.match(/^a .*/)) {
                 obj.attrs.push({ title: line_split[1], type: line_split[3]});
               } 

               if(line.match(/^m .*/)) {
                 obj.methods.push({ title: line_split[1] });
               } 

               if(line.match(/^s .*/)) {
                 obj.statics.push({ title: line_split[1] });
               } 
             });
             return obj;
         },
         parse: function(mcode){
             var toParse = mcode.split("\n")
             var classes = [];
             var classes_result = { classes: []};
             var classText = '';

             angular.forEach(toParse, function(line, i){
               if(line.match(/^C .*/)) {
                 if(classText !== '') {
                    classes.push(classText); // copy
                 }
                 classText = line+"\n";
               } else if(classText !== '') {
                 classText += line+"\n";
               }
             });
             
             // Last One
             if(classText !== '') {
                classes.push(classText); // copy
             }

             var parent = this;
             angular.forEach(classes, function(class_obj, i){
                classes_result.classes.push(parent.parseClass(class_obj));
             });

             return classes_result;
         }
     }; 
  });
