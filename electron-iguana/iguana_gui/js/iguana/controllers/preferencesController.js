
'use strict';

angular.module('iguanaApp.controllers').controller('preferencesController',
  function($scope, $rootScope, $timeout, $log, storageService) {
    var self = this;
    //var fc = profileService.focusedClient;
    $scope.deleted = false;
    //if (fc.credentials && !fc.credentials.mnemonicEncrypted && !fc.credentials.mnemonic) {
     // $scope.deleted = true;
    //}
    this.currentLanguageName = $rootScope.app_config.wallet.settings.defaultLanguageName;
    this.unit = {unitName: $rootScope.app_config.wallet.settings.unitName};
    this.selectedAlternative = {name: $rootScope.app_config.wallet.settings.alternativeName};
    this.currentFeeLevel = $rootScope.app_config.wallet.settings.feeLevel;
    this.init = function() {
      //var config = configService.getSync();
      //var fc = profileService.focusedClient;
      
      this.externalSource="Ledger";
      //if (fc) {
      //  $scope.encrypt = fc.hasPrivKeyEncrypted();
       // this.externalSource = fc.getPrivKeyExternalSourceName() == 'ledger' ? "Ledger" : null;
        // TODO externalAccount
        //this.externalIndex = fc.getExternalIndex();
     // }

      if (window.touchidAvailable) {
        //var walletId = fc.credentials.walletId;
        this.touchidAvailable = true;
        //config.touchIdFor = config.touchIdFor || {};
        $scope.touchid = "ID";//config.touchIdFor[walletId];
      }
    };

    var unwatchEncrypt = $scope.$watch('encrypt', function(val) {
      /*var fc = profileService.focusedClient;
      if (!fc) return;

      if (val && !fc.hasPrivKeyEncrypted()) {
        $rootScope.$emit('Local/NeedsPassword', true, function(err, password) {
          if (err || !password) {
            $scope.encrypt = false;
            return;
          }
          profileService.setPrivateKeyEncryptionFC(password, function() {
            $rootScope.$emit('Local/NewEncryptionSetting');
            $scope.encrypt = true;
          });
        });
      } else {
        if (!val && fc.hasPrivKeyEncrypted()) {
          profileService.unlockFC(function(err) {
            if (err) {
              $scope.encrypt = true;
              return;
            }
            profileService.disablePrivateKeyEncryptionFC(function(err) {
              $rootScope.$emit('Local/NewEncryptionSetting');
              if (err) {
                $scope.encrypt = true;
                $log.error(err);
                return;
              }
              $scope.encrypt = false;
            });
          });
        }
      }*/
    });

    var unwatchRequestTouchid = $scope.$watch('touchid', function(newVal, oldVal) {
      if (newVal == oldVal || $scope.touchidError) {
        $scope.touchidError = false;
        return;
      }
      //var walletId = profileService.focusedClient.credentials.walletId;

      $rootScope.app_config.touchIdFor = {};
      opts.touchIdFor[walletId] = newVal;

      $rootScope.$emit('Local/RequestTouchid', function(err) {
        if (err) {
          $log.debug(err);
          $timeout(function() {
            $scope.touchidError = true;
            $scope.touchid = oldVal;
          }, 100);
        } else {
          /*configService.set(opts, function(err) {
            if (err) {
              $log.debug(err);
              $scope.touchidError = true;
              $scope.touchid = oldVal;
            }
          });*/

        storageService.storeConfig($rootScope.app_config, function(err) {
          if (err) {
            $log.debug(err);
          }
          $scope.touchidError = true;
          $scope.touchid = oldVal;
      });
        }
      });
    });

    $scope.$on('$destroy', function() {
      unwatchEncrypt();
      unwatchRequestTouchid();
    });
  });
