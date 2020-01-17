import Component from '@ember/component';
import Ember from "ember";
import { computed } from '@ember/object';

export default Component.extend({
  store: Ember.inject.service(),

  limit: 10,
  offset: 0,
  pageSize: 10,
  sort: 'questionText',
  dir:'',

  query: null,
  questionsModel: [],
  INDEX: null,
  queryPath: 'questionText',
  scrolledLines: 0,
  flagAdd: false,
  flagDelete: false,

  modelAttributes:

    [{'key': 'questionText', 'name': 'Name', 'dir': 'asc', 'class': 'left aligned seven wide column'},
      {'key': 'type', 'name': 'Question Type', 'dir': '', 'class': 'left aligned seven wide column'}],


  activeModel: Ember.observer('offset', 'limit', 'sort', 'dir','flagAdd','flagDelete', function () {
    let self = this;

    this.get('store').query('question', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('questionsModel', records.toArray());
    });
  }),

  filterQuestions: Ember.observer('query', 'queryPath', function () {
    let self = this;

    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^"+queryText);
    } else {
      this.set('regex', '');
    }

    this.get('store').query('question', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
      self.set('questionsModel', records.toArray());
    });
  }),

  init() {
    this._super(...arguments);
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    let self = this;

    this.get('store').query('question', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('questionsModel', records.toArray());
    });
  },

  didInsertElement: function() {
    this._super(...arguments);
    this.bindScrolling();
  },
  willRemoveElement: function() {
    this._super(...arguments);
    this.unbindScrolling();
  },

  scrolled: function() {
    if (this.get('scrolledLines') < Ember.$("#myWindow").scrollTop()) {
      this.set('scrolledLines', Ember.$("#myWindow").scrollTop());
      this.set('limit', this.get('limit') + 10);
    }
  },
  bindScrolling: function() {
    let onScroll = function() {
      Ember.run.debounce(this, this.scrolled, 500);
    };
    Ember.$("#myWindow").bind('touchmove', onScroll);
    Ember.$("#myWindow").bind('scroll', onScroll);
  },
  unbindScrolling: function() {
    Ember.$("#myWindow").unbind('scroll');
    Ember.$("#myWindow").unbind('touchmove');
  },

  actions:{
    sortColumn(columnName, direction) {

      this.get('modelAttributes').forEach((element)=>{
        if (element.key === columnName) {
          if (direction === 'asc') {
            Ember.set(element, 'dir', 'desc');
            this.set('dir', 'desc');
          }
          else if (direction === 'desc') {
            Ember.set(element, 'dir', 'asc');
            this.set('dir', 'asc');
          } else {
            Ember.set(element, 'dir', 'asc');
            this.set('dir', 'asc');
          }
        }
        else
          Ember.set(element, 'dir', '');
      });
      this.set('sort', columnName);
    }
  }
});
