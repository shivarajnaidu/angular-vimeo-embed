/**
 * angular-vimeo-embed.js
 * (c) 2014 Vincenzo Merolla
 * License: MIT
 */

(function(window, angular) {
  'use strict';

  angular.module('vimeoEmbed', [])
    .directive('vimeoVideo', ['VimeoService', vimeoVideo])

    .factory('VimeoService', ['$http', '$sce', VimeoService]);

  function vimeoVideo(VimeoService) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        videoId: '=',
        videoUrl: '=',
        playerOpts: '=',
        playerHeight: '=',
        playerWidth: '=',
        api: '='
      },
      link: function(scope, element, attrs, ctrl) {

        var playerId = attrs.playerId || element[0].id;
        element[0].id = playerId;

        var videoUrl = scope.videoId ? 'https://vimeo.com/' + scope.videoId : scope.videoUrl,
          params = '?url=' + encodeURIComponent(videoUrl) + '&player_id=' + playerId,
          options = scope.playerOpts || null;

        if (scope.playerWidth) { params += '&width=' + scope.playerWidth; }
        if (scope.playerHeight) { params += '&height=' + scope.playerHeight; }
        if (scope.api) { params += '&api=1'; }

        //If params obj is passed, loop through object keys and append query param
        if (options) {
          for (var prop in options) {
            params += '&' + prop + '=' + options[prop];
          }
        }

        VimeoService.oEmbed(params)
          .then(function(data) {
            element.html(data.html);
          }).catch(function(error) {
            console.error(error)
            element.html('<div>Failed to retreive video.</div>');
          });

      }
    };
  }

  function VimeoService($http, $sce) {
    var endpoint = 'https://vimeo.com/api/oembed.json';

    function oEmbed(params) {
      return $http.jsonp($sce.trustAsResourceUrl(endpoint + params), { jsonpCallbackParam: 'callback' })
        .then(function(res) {
          return res.data;
        })
        .catch(function(error) {
          throw error;
        })
    }


    return {
      oEmbed: oEmbed
    };

  }
})(window, window.angular);
