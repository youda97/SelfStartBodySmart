import Component from '@ember/component';
import Ember from "ember";
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';



export default Component.extend({
  store: service(),
  model: null,
  //ajax: service(),
  temp: false,
  authentication: service('auth'),
  authent: service('auth'),
  error: null,

  loggingIn: true,

  router: service(),

  errorMessage: Ember.computed('error', function () {
    return this.get('error');
  }),

  actions: {

    forgotPassword() {
      this.set('loggingIn', false);
    },

    login() {
      this.set('loggingIn', true);
    },

    deny(){
      $('.ui.login.modal.tiny').modal('hide');
    },

    submit(){
      var auth = this.get("authentication");
      var self = this;
      var myStore = self.get('store');

      if(this.get('Email') === "root@root.ca") {
        auth.openRoot(this.get('PWord')).then(function (name) {
          console.log(name);
          console.log("anything");
          auth.set('isLoginRequested', false);
          auth.setName(name);

          $('.ui.login.modal.tiny').modal('hide');
          self.get('router').transitionTo('admin');
        }, function () {
          //console.log("Root" + error);
        });
      } else {

      auth.open(this.get('Email'), this.get('PWord')).then(function() {
        auth.set('isLoginRequested', false);
        
        var name = auth.decrypt(localStorage.getItem('sas-session-id'));
        myStore.queryRecord('patient', {filter: {"email": name}}).then(function (patient) {
            console.log('name')
            console.log(patient);
            if (patient) {
              self.get('router').transitionTo('client');
            } else {
              myStore.queryRecord('physiotherapest', {filter: {"email": name}}).then(function (physio) {
                if (physio) {
                  self.get('router').transitionTo('practitioner');
                } 
              });
            }
        });
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

        // if(auth.client) {
        //   self.get('router').transitionTo('client');
        // } else if(auth.prac) {
        //   self.get('router').transitionTo('practitioner');
        // } else if(auth.admin) {
        //   self.get('router').transitionTo('admin');
        // }
        $('.ui.login.modal.tiny').modal('hide');
      }, function(error) {
        console.log(error);
        // if(error) {
          if (error === "passwordReset") {
            Ember.$('.ui.changePassword.modal').modal({
              // closable: false,
              // detachable: false,
              onDeny: function () {
                self.set('error', null);
                return true;
              },
              onApprove: function () {
                if (!self.get('firstPassword') || self.get('firstPassword').trim().length === 0) {
                  self.set('error', 'Your must enter a password value');
                  return false;
                } else {
                  if (self.get('firstPassword') !== self.get('secondPassword')) {
                    self.set('error', 'Your password and confirmation password do not match');
                    return false;
                  } else {
                    self.set('error', null);
                    // var ourAuth = self.get('authent')
                    var myStore = self.get('store');
                    var userName = self.get('name');
                    var hashedPassword = auth.hash(self.get('firstPassword'));
                    console.log("BEfore");
                    console.log(self.get('Email'));
                    myStore.queryRecord('password', {filter: {"email": self.get('Email')}}).then(function (userShadow) {
                      console.log("hashedPassword", hashedPassword);
                      auth.set('encryptedPassword', hashedPassword);
                      userShadow.set('encryptedPassword', hashedPassword);
                      userShadow.set('passwordMustChanged', true);
                      console.log(userShadow);
                      userShadow.set('passwordReset', false);
                      userShadow.save().then(function () {
                        // auth.close();
                        auth.set('isLoginRequested', true);
                        console.log("Success update");
                        // self.get('routing').transitionTo('login');
                        //  return true;
                      });
                    });
                  }
                }
              }
            })
              .modal('show');
          } else {
            if (error === "wrongUserName") {
              self.set('error', 'Please enter a correct user name');
            } else {
              if (error === "wrongPassword") {
                console.log("Wrong Pass");
                self.set('error', 'Please enter a correct password');
              } else {
                if (error === "loginFailed") {
                  self.set('error', 'Login Failed ...');
                }
                // else {
                //   this.get('router').transitionTo('client');
                // }
              }
            }
          }
        // }
        // return;
      });
    }
       // this.get('router').transitionTo('client');
    },

    logout: function() {
      localStorage.clear();
    },

    openModal: function ()  {
      $('.ui.login.modal.tiny').modal({}).modal('show')
    },
  }

});
