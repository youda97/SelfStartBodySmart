import Component from '@ember/component';
import Ember from "ember";
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  store: service(),
  router: service(),

  pageSize: 200,
  sort: 'questionText',
  dir:'',
  query: null,

  questionAttributes:
    [{'key': 'questionText', 'name':'Question', 'dir' : 'asc', 'class' :'left aligned eleven wide column'}],

  formAttributes:

    [{'key': 'questionText', 'name':'Question', 'dir' : '','class' :'left aligned six wide column'},
      {'key': 'type', 'name':'Type', 'dir' : '','class' :'left aligned six wide column'}],

  questionsModel: [],
  sortBy: ['name'],
  sortByDesc: ['name:desc'],
  sortedNames: Ember.computed.sort('questionsModel','sortBy'),
  sortedNamesDesc: Ember.computed.sort('questionsModel','sortByDesc'),

  formsModel: [],
  INDEX: null,
  queryPath: 'questionText',
  scrolledLines: 0,
  flagAdd: false,
  flagDelete: false,
  asc: true,

  filterquestions: Ember.observer('query', 'queryPath', function () {
    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^"+queryText);
    } else {
      this.set('regex', '');
    }


    var self = this;


    this.get('store').query('question', this.getProperties(['sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('questionsModel', records.toArray());
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

    self.get('store').query('question-order', {filter: {'form': this.get('model').id}}).then((questions) => {

      this.get('formsModel').clear();
      // console.log(this.get('formsModel'));
      questions.forEach((q)=>{
        // console.log(exe.get('question'));
        this.get('formsModel').pushObject(q.get('question'));
      });

       self.get('formsModel').forEach((rec)=>{
         rec['selectedList'] = false;
       })
    });

    this.get('store').query('question', this.getProperties(['sort', 'dir', 'queryPath', 'regex'])).then(function (records) {


      self.set('questionsModel', records.toArray());

      self.get('questionsModel').forEach((rec)=>{
        rec.set('selected', false);
      })
    });


  },


  actions:{
    sortColumn(columnName, direction) {

      this.get('questionAttributes').forEach((element)=>{
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

      this.get('questionsModel').forEach((rec)=>{
        if (rec['selected']) {
          temp.pushObject(rec);
        }
        count ++;
      });
      if (count === this.get('questionsModel').length) {
        temp.forEach((rec)=>{
          rec.set('selectedList', false);
          self.get('formsModel').pushObject(rec);
          self.get('questionsModel').removeObject(rec);
        });
      }


    },
    remove(){
      let self= this;
      let temp = [];
      let count = 0;

      this.get('formsModel').forEach((rec)=>{
        if (rec['selectedList']) {
          temp.pushObject(rec);
          console.log("im here");
        }
        count ++;
      });
      if (count === this.get('formsModel').length) {
        temp.forEach((rec)=>{
          rec.set('selected', false);
          self.get('questionsModel').pushObject(rec);
          self.get('formsModel').removeObject(rec);
        });
      }
    },

    reorderItems(itemModels, draggedModel) {
      this.set('formsModel', itemModels);
      this.set('formsModel.justDragged', draggedModel);
    },


    submit(){
      let self = this;

      self.get('store').query('question-order', {filter: {'form': this.get('model').id}}).then((questions) => {
        questions.forEach((question) => {
          question.save().then((rec)=>{
            rec.destroyRecord();
          })

        })
      });

      self.get('store').findRecord('form', this.get('model').id).then((form)=>{
        form.set('name', this.get('model.name'));
        form.set('description', this.get('model.description'));

        // console.log(this.get('model.name'));

        form.save().then((form) => {

          this.get('formsModel').forEach((rec, i) => {
            let list = this.get('store').createRecord('question-order', {
              order: i + 1,
              question: rec,
              form: form
            });

            list.save().then(()=>{
              //route back
              this.get('router').transitionTo('admin.forms');
            });
          });


        })
      });
    },
  }
});
