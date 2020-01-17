import Ember from 'ember';
import crypto from "npm:crypto-browserify";

export default Ember.Service.extend({
  email: null,
  encryptedPassword: null,
  isAuthenticated: false,
  store: Ember.inject.service(),
  isLoginRequested: false,
  userCList: null,
  accountType: null,
  client: false,
  admin: false,
  prac: false,
  ajax: Ember.inject.service(),

  getName: Ember.computed(function () {
    var identity = localStorage.getItem('sas-session-id');
    if (identity) {
      return this.decrypt(identity);
    } else {
      return null;
    }
  }),

  init(){
    this._super(...arguments);
    
    if(localStorage.getItem('sas-session-id')){
      this.set("isAuthenticated", true);
    }
  },

  didRender(){
    // var myStore = this.get('store');
    // var name = this.decrypt(localStorage.getItem("sas-session-id"))
    // myStore.queryRecord('patient', {filter: {"email": name}}).then(function (patient) {
    //     console.log('name')
    //     if (patient) {
    //       self.set("client", true);
    //     }
    //   });
    //   myStore.queryRecord('physiotherapest', {filter: {"email": name}}).then(function (physio) {
    //     if (physio) {
    //       self.set("prac", true);
    //     }
    //   });
    //   myStore.queryRecord('administrator', {filter: {"email": name}}).then(function (admin) {
    //     if (admin) {
    //       self.set("admin", true);
    //     }
    //   });
  },

  setName(name) {
    console.log(name);
    this.set('email', name.toLowerCase());
    let self = this;
    var identity = this.encrypt(this.get('email'));
    localStorage.setItem('sas-session-id', identity);

    // var myStore = this.get('store');
    
    // myStore.queryRecord('patient', {filter: {"email": name}}).then(function (patient) {
    //     // console.log('name')
    //     if (patient) {
    //       self.set("client", true);
    //     }
    //   });
    //   myStore.queryRecord('physiotherapest', {filter: {"email": name}}).then(function (physio) {
    //     if (physio) {
    //       self.set("prac", true);
    //     }
    //   });
    //   myStore.queryRecord('administrator', {filter: {"email": name}}).then(function (admin) {
    //     if (admin) {
    //       self.set("admin", true);
    //     }
    //   });
    console.log("In set item", this.get('email'));
  },

  setAccountType(value){
    this.set("accountType", value);
    var accType = this.encrypt(this.get("accountType"));
    localStorage.setItem("accType", accType);
  },

  setPassword(password) {
    this.set('encryptedPassword', this.hash(password));
  },

  hash(text){
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
  },

  encrypt(plainText){
    var cipher = crypto.createCipher('aes256', 'SE3350b Winter 2018');
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
  },

  decrypt(cipherText){
    var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2018');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
  },

  open(email, password) {
    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      // send username and password to the server asking for a challenge (nonce)
      self.setPassword(password);
      var myStore = self.get('store');

      var loginRequest = myStore.createRecord('login', {
        email: email,
        password: null, //first message password should be null
        nonce: null,  // a challenge from the server
        response: null,  // client response
        requestType: "open"
      });

      // send the first message of the authentication protocol
      loginRequest.save().then(function (serverResponse) {
        if (serverResponse.get('loginFailed')) {
          self.close(name);
          reject("loginFailed");
        } else {
          // encrypt server nonce and set client response
          if (serverResponse.get('wrongUserName')) {
            //       self.close(name);
            reject("wrongUserName");
          } else {
            var NONCE = self.encrypt(serverResponse.get('nonce'));
              var clientResponse = myStore.createRecord('login', {
                email: email,
                password: self.get('encryptedPassword'),
                nonce: null,  // a challenge from the server
                response: NONCE,  // client response
                requestType: "openResponse"
              });

              // send the third message of the authentication protocol
              clientResponse.save().then(function (message4) { //get the token (message 4 in the protocol)
                // and get the capability list or no access flag
                // set the capability list as a token property in this service and return true
                // or set the token property null and return false.
                if (serverResponse.get('loginFailed')) {
                  ////  self.close(name);
                  reject("loginFailed");
                } else {

                  if (message4.get('wrongPassword')) {
                    ////self.close(name);
                    reject("wrongPassword");
                  } else {
                    if (message4.get('passwordReset')) {
                      //self.close(name);
                      reject("passwordReset");
                    } else {
                      console.log("In else");
                      self.setName(message4.get('email'));

      //                 var myStore = self.get('store');
      //                 var name = message4.get('email');
      //                 myStore.queryRecord('patient', {filter: {"email": name}}).then(function (patient) {
      //                   console.log('name')
      //                 if (patient) {
      //     self.set("client", true);
      //   }
      // });
      // myStore.queryRecord('physiotherapest', {filter: {"email": name}}).then(function (physio) {
      //   if (physio) {
      //     self.set("prac", true);
      //   }
      // });
      // myStore.queryRecord('administrator', {filter: {"email": name}}).then(function (admin) {
      //   if (admin) {
      //     self.set("admin", true);
      //   }
      // });
                      // var userRole = self.decrypt(message4.get('token'));
                      var userRole = null;
                      self.set('isAuthenticated', true);
                      self.set('userCList', userRole);
                      // self.get('router').transitionTo('client');
                      resolve(userRole);
                    }
                  }
                }

              });
          }

        }
      });

    });
  },

  fetch()
  {
    // get the current token from backend database
    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var identity = localStorage.getItem('sas-session-id');
      if(identity) {
        var name = self.decrypt(identity);
        self.set('email', name);
        var myStore = self.get('store');
        var fetchRequest = myStore.createRecord('login', {
          email: name,
          password: null,
          nonce: null,
          response: null,
          requestType: "fetch"
        });
        fetchRequest.save().then(function (serverResponse) {
          if (serverResponse.get('loginFailed')) {
            self.close(name);
            reject("fetchFailed");
          } else {
            var NONCE = self.encrypt(serverResponse.get('nonce'));
            var clientResponse = myStore.createRecord('login', {
              email: name,
              password: null,
              nonce: null,  // a challenge from the server
              response: NONCE,  // client response
              requestType: "fetchResponse"
            });

            // send the third message of the authentication protocol
            clientResponse.save().then(function (givenToken) {
              if (givenToken.get('loginFailed')) {
                self.close(name);
                reject("fetchFailed");
              } else {
                // var plainToken = self.decrypt(givenToken.get('token'));
                var plainToken = null;
                self.set('isAuthenticated', true);
                self.set('userCList', plainToken);
                resolve(plainToken);
              }
            });

          }

        });
      } else {
        reject("userNotActive");
      }
    });
  },

  close(user)
  {
    var myStore = this.get('store');
    myStore.query('login', {filter: {email: user}}).then(function (Login) {
      if (Login) {
        Login.forEach((record) => {
          record.destroyRecord();
        });
      }
    });
    window.localStorage.removeItem('sas-session-id');
    this.set('getName', null);
    this.set('email', null);
    this.set('encryptedPassword', null);
    this.set('isAuthenticated', false);
    this.set('isLoginRequested', false);
  },

  closeNoParams()
  {
    console.log(localStorage.getItem('sas-session-id'))
    var email = this.decrypt(localStorage.getItem('sas-session-id'));
    console.log(email);
    var myStore = this.get('store');
    myStore.queryRecord('login', {filter: {"email": email}}).then(function (Login) {
      if (Login) {
        Login.destroyRecord();
      }
    });
    window.localStorage.removeItem('sas-session-id');
    this.set('getName', null);
    this.set('email', null);
    this.set('encryptedPassword', null);
    this.set('isAuthenticated', false);
    this.set('isLoginRequested', false);
    this.set("client", false);
    this.set("prac", false);
    this.set("admin", false);
  },

  openRoot(password)
  {
    console.log(password)
    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (password) {
        var myStore = self.get('store');
        var loginRequest = myStore.createRecord('root', {
          password: null,
          nonce: null,
          response: null
        });
        loginRequest.save().then(function (serverResponse) {
          // encrypt server nonce and set client response
          var NONCE = self.encrypt(serverResponse.get('nonce'));
          var clientResponse = myStore.createRecord('root', {
            password: self.encrypt(self.hash(password)),
            nonce: null,
            response: NONCE
          });
          clientResponse.save().then(function (message4) {
            if (message4.get('wrongPassword')) {
              self.closeRoot();
              reject("wrongPassword");
            } else {
              // self.setName("Root");
              self.set('isAuthenticated', true);
              resolve("root@root.ca");
            }

          });
        });
      } else {
        self.closeRoot();
        reject("wrongPassword");
      }

    });
  },

  closeRoot()
  {
    var myStore = this.get('store');
    // myStore.queryRecord('root', {}).then(function (Login) {
    //   if (Login) {
    //     Login.destroyRecord();
    //   }
    // });
    window.localStorage.removeItem('sas-session-id');
    this.set('getName', null);
    this.set('email', null);
    this.set('isAuthenticated', false);
    this.set('isLoginRequested', false);
  }
})
;
