import Component from '@ember/component';
import Ember from "ember";
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  store: service(),
  router: service(),

  pageSize: 200,
  sort: 'name',
  dir: '',
  query: null,

  exerciseAttributes:
    [{'key': 'name', 'name': 'Name', 'dir': 'asc', 'class': 'left aligned eleven wide column'}],


  menuAttributes:

    [{'key': 'sets', 'name': 'Sets', 'dir': 'asc', 'class': 'left aligned two wide column'},
      {'key': 'reps', 'name': 'Reps', 'dir': '', 'class': 'left aligned two wide column'},
      {'key': 'duration', 'name': 'Duration', 'dir': '', 'class': 'left aligned three wide column'},
      {'key': 'name', 'name': 'Exercise', 'dir': '', 'class': 'left aligned five wide column'}],

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
  //   var a = [], diff = [];
  //
  //   this.get('store').query('exercise', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
  //
  //     //  self.set('exercisesModel', records.toArray());
  //
  //   });
  //
  // }),


  filterexercises: Ember.observer('query', 'queryPath', function () {
    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^" + queryText);
    } else {
      this.set('regex', '');
    }

    // this.get('store').query('exercise', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
    //   this.set('exercisesModel', records.toArray());
    // });

    var self = this;
    var a = [];

    this.get('store').query('exercise', this.getProperties(['sort', 'dir', 'queryPath', 'regex'])).then(function (records) {

      self.set('exercisesModel', records.toArray());

      // function arr_diff(a1, a2) {
      //   for (var i = 0; i < a1.length; i++) {
      //     a[a1[i]] = true;
      //   }
      //   for (var j = 0; j < a2.length; j++) {
      //     if (a[a2[j]]) {
      //       delete a[a2[j]];
      //     } else {
      //       a[a2[j]] = true;
      //     }
      //   }
      //   for (var k in a) {
      //     self.get('exercisesModel').pushObject(k);
      //   }
      //
      //   console.log(self.get('exercisesModel'));
      //   return self.get('exercisesModel');
      // }

      //arr_diff(records.toArray(), self.get('listModel'));
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

    self.get('store').query('exercise-list', {filter: {'rehabilitationPlan': this.get('model').id}}).then((exercises) => {

      this.get('listModel').clear();
      //console.log(this.get('listModel'));
      exercises.forEach((exe)=>{
        // console.log(exe.get('exercise'));
        this.get('listModel').pushObject(exe.get('exercise'));
      });
      self.get('listModel').forEach((rec)=>{
        rec['selectedList'] = false;
      })
    });

    this.get('store').query('exercise', this.getProperties(['sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('exercisesModel', records.toArray());


      //console.log(self.get('exercisesModel'));

      self.get('exercisesModel').forEach((rec) => {
        rec.set('selected', false);
      })
    });


    // this.get('model').get((rec) => {
    //   console.log(rec.id);


    // });

    //   this.get('store').findAll('exercise-list');

    //   self.set('listModel', 'model');
  },



  actions: {
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

    add() {
      let self = this;
      let temp = [];
      let count = 0;



      this.get('exercisesModel').forEach((rec) => {
        if (rec['selected']) {
          temp.pushObject(rec);
        }
        count++;
      });
      if (count === this.get('exercisesModel').length) {
        temp.forEach((rec) => {
          rec.set('selectedList', false);
          self.get('listModel').pushObject(rec);
          self.get('exercisesModel').removeObject(rec);
        });
      }


    },
    remove() {
      let self = this;
      let temp = [];
      let count = 0;

      this.get('listModel').forEach((rec) => {
        if (rec['selectedList']) {
          temp.pushObject(rec);
        }
        count++;
      });
      if (count === this.get('listModel').length) {
        temp.forEach((rec) => {
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


    submit() {
      let self = this;

      //   this.get('store').findRecord('rehabilitationplan', this.get('model.id')).then((rec) =>{
      //     rec.set('planName', this.get('planName') );
      //     rec.set('description', this.get('description') );

      //  });
      // delete the existing exercise-list then assign the new list

      self.get('store').query('exercise-list', {filter: {'rehabilitationPlan': this.get('model').id}}).then((exercises) => {
        exercises.forEach((exercise) => {
          // exercise.set('rehabilitationPlan', null);
          exercise.save().then((rec)=>{
            rec.destroyRecord();
          })

        })
      });

       self.get('store').findRecord('rehabilitationplan', this.get('model').id).then((rehabilitationplan)=>{
         rehabilitationplan.set('planName', this.get('model.planName'));
         rehabilitationplan.set('description', this.get('model.description'));

         console.log(this.get('model.planName'));

         rehabilitationplan.save().then((plan) => {

           this.get('listModel').forEach((rec, i) => {
             let list = this.get('store').createRecord('exercise-list', {
               order: i + 1,
               exercise: rec,
               rehabilitationPlan: plan
             });

             list.save().then(()=>{
               //route back
               this.get('router').transitionTo('practitioner.rehabplans');
             });
           });


         })
       });
    },
  }
});
