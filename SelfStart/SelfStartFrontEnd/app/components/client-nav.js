import Component from '@ember/component';
import $ from 'jquery';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName:'',
  auth: inject('auth'),
  show: false,
  DS: inject('store'),
  
  init() {
    this._super(...arguments);
    // console.log(localStorage.getItem('sas-session-id'))
    if(localStorage.getItem('sas-session-id')) {
    var email = this.get('auth').decrypt(localStorage.getItem('sas-session-id'));
    console.log(email);
    var myStore = this.get('store');
    var self = this;
    this.get('DS').queryRecord('patient', {filter: {"email": email}}).then(function (patient) {
      if (patient) {
        self.set('show', true);
      }
    });
  }
  },

  didInsertElement() {
    this._super(...arguments);

    // var Skype=new function(){var t=[],e=!1,n="https://swc.cdn.skype.com/contactme/v/1.0.0/skype-uri.min.js";this.ui=function(a){for(var c=document.getElementsByTagName("script"),i=c.length,r=!1;i--;)if(c[i].src===n){r=!0;break}if(!r){var s=document.getElementsByTagName("head")[0],u=document.createElement("script");u.setAttribute("type","text/javascript"),u.setAttribute("src",n),u.onload=function(){e=!0;for(var n=t.length;n--;)SkypeButton.ui(t[n])},s.appendChild(u)}e?SkypeButton.ui(a):t.push(a)}};
    var Skype=new function(){var t=[],e=!1,n="https://swc.cdn.skype.com/contactme/v/1.0.0/skype-uri.min.js";this.ui=function(a){for(var c=document.getElementsByTagName("script"),i=c.length,r=!1;i--;)if(c[i].src===n){r=!0;break}if(!r){var s=document.getElementsByTagName("head")[0],u=document.createElement("script");u.setAttribute("type","text/javascript"),u.setAttribute("src",n),u.onload=function(){e=!0;for(var n=t.length;n--;)SkypeButton.ui(t[n])},s.appendChild(u)}e?SkypeButton.ui(a):t.push(a)}};
    
    Skype.ui({
      "name": "chat",
      "element": "SkypeButton_Call",
      //For participant, must have full Skype name including the "live:"
      "participants": ["live:ramzi_abdullahi"],
      "imageSize": 24,
      "imageColor": "white"
    });

    $('body')
      .visibility({
        offset: -10,
        observeChanges: false,
        once: false,
        continuous: false,
        onTopPassed: function () {
          requestAnimationFrame(function () {
            $('.following.bar')
              .addClass('light fixed')
              .find('.menu')
              .removeClass('inverted');
            $('.following .additional.item')
              .transition('scale in', 750);
            $('.selfStart')
              .attr("src",'/assets/images/marcotte-self-start-bodysmartFINAL.png');

          });
        },
        onTopPassedReverse: function () {
          requestAnimationFrame(function () {
            $('.following.bar')
              .removeClass('light fixed')
              .find('.menu')
              .addClass('inverted')
              .find('.additional.item')
              .transition('hide');
            $('.selfStart')
              .attr("src",'/assets/images/home/Header.png');

          });
        }
      })
    ;
  },

  actions: {
    logout: function () {
      // localStorage.clear();
      // localStorage.setItem('loggedIn', false);
      this.get('auth').closeNoParams();

      // this.get('routing').transitionTo('home');
      // this.set('loggedOut', true);
      // this.get("auth").set('isAuthenticated', false);
      // console.log(this.loggedOut)
    },
  },
});
