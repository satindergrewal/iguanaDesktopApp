

'use strict';
angular.module('iguanaApp.services')
  .factory('testVersionRPC', function($rootScope,$http,$timeout,go) {
      var root=this;
      root={
          PORT:"",user:"",password:"",passPhrase:"",isCredSaved:"",
          protocol:"http",activeCOIN:"BTCD",passphraseOK:false, 
          isEncrypted:false,isLoggedin:false,
          rpcOK:false,BTCErrorMessage:"",BTCDErrorMessage:"",action:"waiting",
          listreceived:{output:{}},
          transactions:{output:{}},
          
          totalBalance:{by_addr:{},by_name:{},total:0},
          settings:{balanceTimer:1},
          iguanaTX:[]
      };
      
      root.makeRPCrequest=function(request, callback){
          //request = JSON.stringify( request );
       $http({
  method: "POST",
  url: root.protocol+"://"+root.user+":"+root.password+"@127.0.0.1:"+root.PORT+"/",
  data: request
}).then(function successCallback(response) {
    console.log('$http post Response is ' + JSON.stringify(response));
    /// calling other one
    if(typeof callback === 'function'){
                callback(request, response);
    
            }
  }, function errorCallback(response) {
     console.log('POST request failed.');
  });
       };
      
      
      root.initRPC=function(user,pass,passphrase,proto){
          root.user=user;
          root.password=pass;
          root.passPhrase=passphrase;
          root.protocol=proto;
          root.activeCOIN="";
          root.BTCDErrorMessage="";
          root.action="waiting";
          root.BTCErrorMessage="";
          root.rpcOK=false;
          root.isLoggedin=false,
           root.checkPORT();
          };
      
      root.checkPORT=function(){
          var BTC="8332",BTCD="14632";
          var request='{ "method": "getinfo", "params": []}';
          
          
          $http({
  method: "POST",
  url: root.protocol+"://"+root.user+":"+root.password+"@127.0.0.1:"+BTC+"/",
  data: request
}).then(function successCallback(response) {
    console.log('$http post Response is ' + JSON.stringify(response));
    /// calling other one
root.PORT=BTC;
root.activeCOIN="BTC";
root.rpcOK=true;
root.isLoggedin=true;
root.action="done";
//root.listreceivedFN();
//root.getBalanceData();

}, function errorCallback(response) {
    if(response.status === 401){
        console.log(response.statusText); 
        root.BTCErrorMessage=response.statusText;
        root.rpcOK="no";
     }
     //console.log(response); 
     if(response.status === -1){
    console.log('Bitcoin wallet not active.');
     root.BTCErrorMessage="Bitcoin wallet not active.";
     }
  });
  
  
  $http({
  method: "POST",
  url: root.protocol+"://"+root.user+":"+root.password+"@127.0.0.1:"+BTCD+"/",
  data: request
}).then(function successCallback(response) {
    console.log('$http post Response is ' + JSON.stringify(response));
    /// calling other one
root.PORT=BTCD;
root.activeCOIN="BTCD";
root.rpcOK=true;
root.isLoggedin=true;
root.action="done";
//root.listreceivedFN();
//root.getBalanceData();
          
}, function errorCallback(response) {
     root.action="error";
    if(response.status === 401){
        console.log(response.statusText);
        root.BTCDErrorMessage=response.statusText;
     }
     
     
     if(response.status === -1){
     console.log('BitcoinDark wallet not active.');
     root.BTCDErrorMessage="BitcoinDark wallet not active.";
     }
     
  });
          
      };
      
      root.checkPassPhrase=function(){
          
          var request='{"id":"iguana_passphrase_test",  "method": "walletpassphrasechange", "params": ["'+root.passPhrase+'", "'+root.passPhrase+'"] }';
          root.makeRPCrequest(request,function(request, response){
              response=JSON.parse(response);
              
              
              if(response.error && response.error.code == -14){
                 root.passphraseOK=false; 
              }else if(response.result == null && response.error == null){
                  root.passphraseOK=true;
                  root.isEncrypted=true;
              }
              
          });
      };
      
      
      root.addmultisigaddress=function(BTCD_pub,handle){
          var request='{"id":"iguana_test_BTCD_pub",   "method": "addmultisigaddress", "params": [1, ["'+BTCD_pub+'"], '+"iguana_"+handle+']}';
          
          root.makeRPCrequest();
          
      };
      
      
      root.listreceivedFN=function(){
          console.log("Accessing the recieved amounts!");
          var request='{"id":"iguana_test", "method": "listreceivedbyaddress", "params": [6 , true] }';
          root.makeRPCrequest(request,function(request, response){
              
              console.log(response.data.result);
              //response=JSON.parse(response);
              root.listreceived.output=response.data.result;
              //$timeout(root.listreceivedFN, root.listreceived.timer*60*1000); // call itself in 2 minutes
              
          });
      };
      
      root.listtransactionsFN=function(){
          console.log("Getting the transactions!");
          var request='{"id":"iguana_test", "method": "listtransactions", "params": ["*", 20, 100] }';
          root.makeRPCrequest(request,function(request, response){
              
              console.log(response.data.result);
              //response=JSON.parse(response);
              root.transactions.output=response.data.result;
              //$timeout(root.listtransactionsFN, root.transactions.timer*60*1000); // call itself in 2 minutes
              
          });
          
      };
      
      
      root.getBalanceData=function(callback){
       /* 
        * Getting recieved by 
        */   
           console.log("Accessing the recieved amounts!");
          var request='{"id":"iguana_test", "method": "listreceivedbyaddress", "params": [6 , true] }';
          root.makeRPCrequest(request,function(request, response){
              
          console.log(response.data.result);
              //response=JSON.parse(response);
          root.listreceived.output=response.data.result;
           
           /*
            * Getting the transactions
            */
          console.log("Getting the transactions!");
          var request='{"id":"iguana_test", "method": "listtransactions", "params": ["*"] }';
          root.makeRPCrequest(request,function(request, response){
              
              console.log(response.data.result);
              //response=JSON.parse(response);
              root.transactions.output=response.data.result;
              //();
              root.calculateBalance(callback);
              //$timeout(root.getBalanceData, root.settings.balanceTimer*60*1000); // call itself in 2 minutes
              
          });
              
              
          });
          
      };
      
      root.calculateBalance=function(callback){
          console.log("Calculating balance");
          
          var total=0,max=0,temp,tx=[],t={};
          
          for(var x in root.listreceived.output){
              temp=root.listreceived.output[x];
              //console.log(temp);
          root.totalBalance.by_addr[temp.address]=0;
           if(temp.account!==""){
               root.totalBalance.by_name[temp.account]=0;
           }
           }
          
          //root.totalBalance.total=total;
          
          for(var x in root.transactions.output){
              temp=root.transactions.output[x];
              if(temp.category==="receive"){
                  t.img="img/icon2.png";
                   t.label="Received";
                  
                root.totalBalance.by_addr[temp.address]=root.totalBalance.by_addr[temp.address]+temp.amount; 
                if(temp.account!==""){
               root.totalBalance.by_name[temp.account]=root.totalBalance.by_name[temp.account]+temp.amount;
           }
           total=total+temp.amount;
              }else if(temp.category==="send"){
                  t.img="img/icon1.png";
                  t.label="Sent to xxx";
                 root.totalBalance.by_addr[temp.address]=root.totalBalance.by_addr[temp.address]-temp.amount; 
                if(temp.account!==""){
               root.totalBalance.by_name[temp.account]=root.totalBalance.by_name[temp.account]-temp.amount;
           }
           total=total-temp.amount;
              }
              t.amt=temp.amount;
                  t.date=temp.timereceived;
              t.txid=temp.txid;
              t.block=temp.blockhash;
           root.totalBalance.total=total;
           
           //console.log(t);
           tx.push(t);
           }
          
          root.iguanaTX=tx;
          
          console.log("Brodcasted");
          callback();
          //$timeout(root.getBalanceData, root.settings.balanceTimer*60*1000);
          //console.log(root.totalBalance);
      };
      
          
      root.convertToDate=function(unixtm){
        
          var date = new Date(unixtm*1000);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
          
      };
      return root;
  });

'use strict';
angular.module('iguanaApp.services')
  .factory('rpcService', function($rootScope,$http,$timeout,go,$q, testVersionRPC,$log) {
      
      var root=testVersionRPC;
      
       var self= {
             callAPI: function(request){
                 var url=root.protocol+"://"+root.user+":"+root.password+"@127.0.0.1:"+root.PORT+"/";
                var promise = $http({
  method: "POST",
  url: url,
  data: request
}).then(function successCallback(response) {
    $log.debug('$http post Response is ' + JSON.stringify(response));
    /// calling other one
    ;
                  // do something with data, if needed
                  return response;
    
  }, function errorCallback(response) {
     $log.debug('POST request failed.');
     return response;
  });
            return promise;
    },
    
    
    getBalance:function(){
        
        var request='{"id":"iguana_test", "method": "listtransactions", "params": ["*"] }';
        return self.callAPI(request);
        
    },
    
    getListAccounts:function(){
        var request='{"id":"iguana_test", "method": "listreceivedbyaddress", "params": [6 , true] }';
         return self.callAPI(request); 
        },
        checkPassphrase:function(passphrase){
            
            var request='{"id":"iguana_passphrase_test",  "method": "walletpassphrasechange", "params": ["'+passphrase+'", "'+passphrase+'"] }';
            return self.callAPI(request); 
          
        },
        validateAddress:function(addr){
           var request='{"id":"iguana_validateaddr_test", "method": "validateaddress", "params": ["'+addr+'"]}';
           return self.callAPI(request);
            
        },
        walletPassphrase:function(pass,time){
            var request='{"id":"iguana_passphrase_test",  "method": "walletpassphrase", "params": ["'+pass+'", '+time+'] }';
            return self.callAPI(request);
        },
        walletLock:function(){
            var request='{"id":"iguana_walletlock_test",  "method": "walletlock", "params": [] }';
            return self.callAPI(request);
        },
        walletSendFrom:function(from,to,amt,minconf,comment,commentto){
          var request='{"id":"iguana_walletSend_test", "method": "sendfrom", "params": ["'+from+'", "'+to+'", '+amt+', '+minconf+', "'+comment+'", "'+commentto+'"] }';  
          return self.callAPI(request);
        },
        walletSendTo:function(to,amt,comment,commentto){
          var request='{"id":"iguana_walletSend_test", "method": "sendtoaddress", "params": ["'+to+'", '+amt+', "'+comment+'", "'+commentto+'"] }';  
          return self.callAPI(request);
        },
        walletEncrypt:function(pass){
            var request='{"jsonrpc": "1.0", "id":"iguana_encrypt_test",  "method": "encryptwallet", "params": ["'+pass+'"] }';  
          
            return self.callAPI(request);
        },
         getnewaddress:function(){
            var request='{"jsonrpc": "1.0", "id":"iguana_address_test",  "method": "getnewaddress", "params": [] }';  
          
            return self.callAPI(request);
        },
        gettransactionDetails:function(tid){
             var request='{"jsonrpc": "1.0", "id":"iguana_TX_test",  "method": "gettransaction", "params": ["'+tid+'"] }';  
          
            return self.callAPI(request);
        },
        setAccountName:function(name,address){
            
             var request='{"jsonrpc": "1.0", "id":"iguana_TX_test",  "method": "gettransaction", "params": ["'+tid+'"] }';  
          
            return self.callAPI(request);
        }
        

      };
      return self;
      
  });