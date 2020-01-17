import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Ember from "ember";
import $ from 'jquery';

export default Component.extend({

  DS: inject('store'),
  auth: inject('auth'),
  model: null,
  loggedOut: !localStorage.getItem('loggedIn'),
  ajax: Ember.inject.service(),
  temp: false,
  loggingIn: true,
  

  authentication() {

    if(localStorage.getItem('temp')) {
      return this.get('ajax').request('http://localhost:8082/Authenticate', {
        method: 'POST',
        data: {
          email: this.get('Email'),
          password: this.get('PWord')
        },
        success: function(res) {
          localStorage.setItem('id_token', res.token);
          localStorage.setItem('user_level', res.user.account.accType);
          localStorage.setItem('_id', res.user._id);
          localStorage.setItem('loggedIn', true);
        }
      });
    } else {
      console.log("NOT AN ACC");
    }
  },


  didRender() {
    this._super(...arguments);
    // if(localStorage.getItem('loggedIn')){
    //   this.set('loggedOut', false);
    // }
    var scrollLink = $('.scroll');

    // Smooth scrolling
    scrollLink.click(function (e) {
      e.preventDefault();
      $('body,html').animate({
        scrollTop: $(this.hash).offset().top
      }, 1000);
    });

    // Active link switching
    $(window).scroll(function () {
      var scrollbarLocation = $(this).scrollTop();

      scrollLink.each(function () {

        var sectionOffset = $(this.hash).offset().top - 20;

        if (sectionOffset <= scrollbarLocation) {
          $(this).parent().addClass('active');
          $(this).parent().siblings().removeClass('active');
        }
      })

    });
  },


  didInsertElement() {
   this._super(...arguments);

      $('#window')
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
                .attr("src",'assets/images/marcotte-self-start-bodysmartFINAL.png');
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
                .attr("src",'assets/images/home/Header.png');
            });
          }
        })
      ;
  },


  actions: {

    forgotPassword() {
      this.set('loggingIn', false);
    },

    login() {
      this.set('loggingIn', true);
    },

    logout: function () {
      // localStorage.clear();
      // localStorage.setItem('loggedIn', false);
      this.get('auth').closeNoParams();
      // this.get('routing').transitionTo('home');
      // this.set('loggedOut', true);
      // this.get("auth").set('isAuthenticated', false);
      // console.log(this.loggedOut)
    },
    deny(){
      $('.ui.login.modal').modal('hide');
    },
    submit(){
      localStorage.setItem('temp', false);
      this.get('ajax').request('http://localhost:8082/patients/' + this.get('Email'), {
        method: 'GET',
        success: function (res) {
          console.log(res);
          if (res.patient) {
            console.log("THIS IS A CLIENT");
            localStorage.setItem('temp', true);
          }
        }
      });
      this.get('ajax').request('http://localhost:8082/administrators/' + this.get('Email'), {
        method: 'GET',
        success: function(res) {
          if(res.admin) {
            console.log("THIS IS A Admin");
            localStorage.setItem('temp', true);
          }
        }
      });

      this.get('ajax').request('http://localhost:8082/physiotherapests/' + this.get('Email'), {
        method: 'GET',
        success: function(res) {
          if(res.physio) {
            console.log("THIS IS A Physio");
            localStorage.setItem('temp', true);
          }
        }
      });

      // if(localStorage.getItem('temp')) {
      this.authentication();
      this.set('loggedOut', false);
      $('.ui.login.modal').modal('hide');
      // } else {
      // console.log("NOT AN ACCOUNT");
      // }
    },

    openModal: function ()  {

      $('.ui.login.modal.tiny').modal({
        // closable: false,
        transition: 'fade down',
        dimmerSettings: { opacity: 0.6 },

      }).modal('show')
    },
  }
});


