var dlg = angular.module('ui.bootstrap.dialog', ['ui.bootstrap']);

var TEMPLATE_ROOT = '/ui-bootstrap-dialog/';

dlg.constant('$dialogConfig', {
  text: {
    close: 'Close',
    ok: 'Ok',
    cancel: 'Cancel'
  }
});

dlg.factory('$dialog', function ($dialogAlert, $dialogPrompt, $dialogConfirm) {
  
  return {
    alert: $dialogAlert,
    prompt: $dialogPrompt,
    confirm: $dialogConfirm
  };

});

dlg.factory('$dialogConfirm', function ($modal, $dialogExtendOptions) {

  return function (textOrOptions, title) {
    var options = $dialogExtendOptions(TEMPLATE_ROOT + 'dialog-confirm.ng.html', textOrOptions, title);
    return $modal.open(options);
  };

});

dlg.factory('$dialogPrompt', function ($modal, $dialogExtendOptions) {

  return function (textOrOptions, defaultValue, title) {
    var options = $dialogExtendOptions(TEMPLATE_ROOT + 'dialog-prompt.ng.html', textOrOptions, title);
    options.defaultValue = options.defaultValue || defaultValue;
    return $modal.open(options);
  };

});

dlg.factory('$dialogAlert', function ($modal, $dialogExtendOptions) {

  return function (textOrOptions, title) {
    var options = $dialogExtendOptions(TEMPLATE_ROOT + 'dialog-alert.ng.html', textOrOptions, title);
    return $modal.open(options);
  };

});

dlg.factory('$dialogExtendOptions', function ($rootScope, $dialogConfig) {

  return function (templateUrl, textOrOptions, title) {
    if (angular.isString(textOrOptions)) {
      textOrOptions = {
        text: textOrOptions
      };
    }

    var options = angular.extend({
      templateUrl: templateUrl,
      title: title || $dialogConfig.text.title,
      scope: $rootScope.$new()
    }, textOrOptions);

    options.scope.$dialog = options;
    options.scope.$config = $dialogConfig;

    return options;
  };

});

dlg.directive('dlgFocus', function ($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element) {

      $timeout(function () {
        var e = $element[0];
        e.focus();

        if (e.tagName === 'INPUT') {
          e.setSelectionRange(0, e.value.length);
        }
      }, 100);

    }
  };
});