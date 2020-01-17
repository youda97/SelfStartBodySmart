import Component from '@ember/component';
import Ember from "ember";
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  store: service(),
  router: service(),

  sort: 'name',
  dir:'',
  query: null,

  exerciseAttributes:
    [{'key': 'name', 'name':'Name', 'dir' : 'asc', 'class' :'left aligned eleven wide column'}],



  menuAttributes:

    [
      {'key': 'sets', 'name':'Sets', 'dir' : 'asc', 'class' :'left aligned two wide column'},
      {'key': 'reps', 'name':'Reps', 'dir' : '','class' :'left aligned two wide column'},
      {'key': 'duration', 'name':'Duration', 'dir' : '','class' :'left aligned three wide column'},
      {'key': 'name', 'name':'Exercise', 'dir' : '','class' :'left aligned five wide column'}],

  exercisesModel: [],
  sortBy: ['name'],
  sortByDesc: ['name:desc'],
  sortedNames: Ember.computed.sort('exercisesModel','sortBy'),
  sortedNamesDesc: Ember.computed.sort('exercisesModel','sortByDesc'),

  listModel: [],
  INDEX: null,
  queryPath: 'name',
  scrolledLines: 0,
  flagAdd: false,
  flagDelete: false,
  asc: true,


  // activeModel: Ember.observer('offset', 'limit', 'sort', 'dir', function () {
  //   var self = this;
  //
  //
  //   this.get('store').query('exercise', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
  //     self.set('sortedNames', records.toArray());
  //
  //   });
  //
  // }),

  // activeAdd: Ember.observer('flagAdd', function () {
  //   this.get('listModel').forEach((rec) => {
  //     rec.set('selectedList', false);
  //   });
  // }),
  //
  // activeRemove: Ember.observer('flagDelete', function () {
  //   this.get('exercisesModel').forEach((rec) => {
  //     rec.set('selected', false);
  //   });
  // }),

  filterexercises: Ember.observer('query', 'queryPath', function () {
    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^"+queryText);
    } else {
      this.set('regex', '');
    }

    // this.get('store').query('exercise', this.getProperties(['sort', 'dir', 'queryPath', 'regex'])).then((records) => {
    //   this.set('exercisesModel', records.toArray());
    // });

    var self = this;


    this.get('store').query('exercise', this.getProperties(['sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('exercisesModel', records.toArray());
    });
  }),

  didRender() {
    this._super(...arguments);

    $(document).ready(function ($) {
      if ($('.floating-labels').length > 0) floatLabels();

      function floatLabels() {
        var inputFields = $('.floating-labels .cd-label').next();
        inputFields.each(function () {
          var singleInput = $(this);
          //check if  is filling one of the form fields
          checkVal(singleInput);
          singleInput.on('change keyup', function () {
            checkVal(singleInput);
          });
        });
      }

      function checkVal(inputField) {
        ( inputField.val() == '' ) ? inputField.prev('.cd-label').removeClass('float') : inputField.prev('.cd-label').addClass('float');
      }

    });
  },

  init() {
    this._super(...arguments);

    let self = this;

    this.get('store').query('exercise', this.getProperties(['sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('exercisesModel', records.toArray());


      //console.log(self.get('exercisesModel'));

      self.get('exercisesModel').forEach((rec)=>{
        rec['selected']  = false;
      })
    });

  },


  actions:{
    sortColumn(columnName, direction) {

      this.get('exerciseAttributes').forEach((element)=>{
        if (element.key === columnName) {
          if (direction === 'asc') {
            Ember.set(element, 'dir', 'desc');
            this.set('dir', 'desc');
            this.set('asc', false);
          }
          else if (direction === 'desc') {
            Ember.set(element, 'dir', 'asc');
            this.set('dir', 'asc');
            this.set('asc', true);
          } else {
            Ember.set(element, 'dir', 'asc');
            this.set('dir', 'asc');
            this.set('asc', true);
          }
        }
        else
          Ember.set(element, 'dir', '');
      });
      this.set('sort', columnName);
    },
    add(){
      let self= this;
      let temp = [];
      let count = 0;

      this.get('exercisesModel').forEach((rec)=>{
        if (rec['selected']) {
          temp.pushObject(rec);
        }
        count ++;
      });
      if (count === this.get('exercisesModel').length) {
        temp.forEach((rec)=>{
          rec.set('selectedList', false);
          self.get('listModel').pushObject(rec);
          self.get('exercisesModel').removeObject(rec);
        });
      }


    },
    remove(){
      let self= this;
      let temp = [];
      let count = 0;

      this.get('listModel').forEach((rec)=>{
        if (rec['selectedList']) {
          temp.pushObject(rec);
        }
        count ++;
      });
      if (count === this.get('listModel').length) {
        temp.forEach((rec)=>{
          rec.set('selected', false);
          self.get('exercisesModel').pushObject(rec);
          self.get('listModel').removeObject(rec);
        });
      }
    },

    reorderItems(itemModels, draggedModel) {
      this.set('listModel', itemModels);
      this.set('listModel.justDragged', draggedModel);
    },


    submit(){
      let self = this;

      let rehabilitationplan = this.get('store').createRecord('rehabilitationplan', {
        planName: self.get('planName'),
        description: self.get('description'),
        date: new Date()
      });

      rehabilitationplan.save().then((plan) => {
        this.get('listModel').forEach((rec, i)=>{
          let list = this.get('store').createRecord('exercise-list', {
            order: i+1,
            exercise: rec,
            rehabilitationPlan: plan
          });
          console.log(i);
          list.save();
        });
        //route back
        this.get('router').transitionTo('practitioner.rehabplans');
      });
    },
  }
});
