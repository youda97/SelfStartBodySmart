import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  introValue: "active",
  appointmentValue: "disabled",
  photoValue: "disabled",
  confirmValue: "disabled",
  DS: inject('store'),
  clientName: "",
  intro: true,
  appointment: false,
  photo: false,
  confirm: false,

  auth: inject('auth'),

  show: false,

  init() {
    this._super(...arguments);
    console.log(localStorage.getItem('sas-session-id'));
    var email = this.get('auth').decrypt(localStorage.getItem('sas-session-id'));
    console.log(email);
    var myStore = this.get('store');
    var self = this;
    this.get('DS').queryRecord('patient', {filter: {"email": email}}).then(function (patient) {
      if (patient) {
        self.set('show', true);
        self.set("clientName", patient.get('givenName'));
      }
    });

    var Skype=new function(){var t=[],e=!1,n="https://swc.cdn.skype.com/contactme/v/1.0.0/skype-uri.min.js";this.ui=function(a){for(var c=document.getElementsByTagName("script"),i=c.length,r=!1;i--;)if(c[i].src===n){r=!0;break}if(!r){var s=document.getElementsByTagName("head")[0],u=document.createElement("script");u.setAttribute("type","text/javascript"),u.setAttribute("src",n),u.onload=function(){e=!0;for(var n=t.length;n--;)SkypeButton.ui(t[n])},s.appendChild(u)}e?SkypeButton.ui(a):t.push(a)}};

    Skype.ui({
      "name": "video",
      "element": "SkypeButton_Call",
      //Must have live:
      "participants": ["live:ramzi_abdullahi"],
      "imageSize": 24,
      "imageColor": "black"
    });
  },

  actions: {
    goToPhoto() {
      this.set('introValue', "completed");
      this.set('photoValue', "active");
      this.set('photo', true);
      this.set('intro', false);
    },

    backToIntro() {
      this.set('introValue', "active");
      this.set('photoValue', "");
      this.set('photo', false);
      this.set('intro', true);
    },
    goToAppointment() {
      this.set('photoValue', "completed");
      this.set('appointmentValue', "active");
      this.set('appointment', true);
      this.set('photo', false);
    },
    backToPhoto() {
      this.set('photoValue', "active");
      this.set('appointmentValue', "");
      this.set('photo', true);
      this.set('appointment', false);
    },
    goToConfirm() {
      this.set('confirmValue', "active");
      this.set('appointmentValue', "completed");
      this.set('appointment', false);
      this.set('confirm', true);
    },
    backToAppointment() {
      this.set('appointmentValue', "active");
      this.set('confirmValue', "");
      this.set('confirm', false);
      this.set('appointment', true);
    },
    goToPaypal() {

    },
  },
});
