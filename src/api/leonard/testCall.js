

(function (factory){
  if(typeof define === 'function' && define.amd){
    console.log(1)
    define(['jquery'],factory)
  }else if(typeof exports === 'object'){
    console.log(2)
    module.exports = factory(require('jquery'))
  } else{
    console.log(3)
    factory(jQuery)
  }

}(function (jQuery){
  'use strict'

  var $ = jQuery
  var _win = window
  var _doc = document
  var $window = $(_win)

  function test (dom){
    console.log(dom.clientWidth)
  }
  $.a = test;
}));
