import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';
import Ember from 'ember';
import { inject as service } from '@ember/service';
import fileObject from "../utils/file-object";
import moment from 'moment';

export default Component.extend({
  auth: inject('auth'),
  DS: inject('store'),
  routing: inject('-routing'),
  router: service(),

  rehabPlan: null,
  planName: Ember.computed.oneWay('model.planName'),
  exerciseList: Ember.A(),
  counter : 1,
  currentExercise: null,
  currentImages: Ember.A(),
  isEnd: false,
  isNFirst: false,
  isLoading: false,
  inExercise:true,


  init(){
    this._super(...arguments);
    this.set('exerciseList' , Ember.A());
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    this.set('rehabPlan', this.get('model'));

    self.get('DS').query('exercise-list', {filter: {'rehabilitationPlan' : self.get('model.id')}}).then(function (obj) {
      let tempcontainer = [];
      obj.forEach(function (temp) {
        tempcontainer.push(temp);
      });
      //sort exercise
      let i=1;
      while(i < tempcontainer.length){
        tempcontainer.forEach(function (obj){
          if (obj.get('order') === i){
            self.get('exerciseList').pushObject(obj.get('exercise'));
            i++;
          }
        });
      }
      //set first exercise
      self.set('currentExercise', (self.get('exerciseList').objectAt(self.get('counter')-1)));
      //check if its last one of the exercise
      if (self.get('counter') >= self.get('exerciseList').length){
        self.set('isEnd', true);
      }
      //get current exercise images
      self.set('isLoading', true);
      self.get('DS').query('image', {filter: {'exercise' : self.get('currentExercise.id')}}).then(function (obj) {
        obj.forEach(function (temp) {
          self.get('currentImages').pushObject(temp);
        });
      });
      self.set('isLoading', false);

      let a = 1;
      let b = self.get('exerciseList').length;
      $('#example4').progress({percent:Math.round(a/b*100)});
    });
  },


  actions:{
    nextExercise(){
      this.set('currentImages' , Ember.A());
      let self = this;
      self.set('isNFirst', true);
      let c =  self.get('counter');
      self.set('counter', c+1);

      if (self.get('counter') >= self.get('exerciseList').length){
        self.set('isEnd', true);
      }
      self.set('currentExercise', (self.get('exerciseList').objectAt(self.get('counter')-1)));



      self.set('isLoading', true);
      self.get('DS').query('image', {filter: {'exercise' : self.get('currentExercise.id')}}).then(function (obj) {
        obj.forEach(function (temp) {
          self.get('currentImages').pushObject(temp);
        });
      });
      self.set('isLoading', false);
      //END change images
      let a = c+1;
      let b = self.get('exerciseList').length;
      $('#example4').progress({percent:Math.round(a/b*100)});


    },
    prevExercise(){
      this.set('currentImages' , Ember.A());
      let self = this;
      let c =  self.get('counter');
      self.set('counter', c-1);

      if (self.get('counter') <= 1){//reached first exercise
        self.set('isNFirst', false);
      }
      else {//did not end
        self.set('isEnd', false);
      }
      //set current exercise
      self.set('currentExercise', (self.get('exerciseList').objectAt(self.get('counter')-1)));

      //get current exercise images
      self.set('isLoading', true);
      self.get('DS').query('image', {filter: {'exercise' : self.get('currentExercise.id')}}).then(function (obj) {
        obj.forEach(function (temp) {
          self.get('currentImages').pushObject(temp);
        });
      });
      self.set('isLoading', false);


      let a = c-1;
      let b = self.get('exerciseList').length;
      $('#example4').progress({percent:Math.round(a/b*100)});
    },

    finishRehabPlan(){
      console.log('done');
      this.set('inExercise', false);

    },
    Sendtests(){
      this.get('router').transitionTo('client.exercise-menu');
    },
  }
});
