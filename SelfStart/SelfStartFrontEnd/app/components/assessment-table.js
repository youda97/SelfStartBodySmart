import Component from '@ember/component';
import Ember from "ember";
import { computed } from '@ember/object';

export default Component.extend({
  store: Ember.inject.service(),

  limit: 10,
  offset: 0,
  pageSize: 10,
  sort: 'name',
  dir:'',
  query: null,
  testModel: [],
  INDEX: null,
  queryPath: 'name',
  scrolledLines: 0,

  rehabclinetLink: Ember.A(),

  modelAttributes:
    [{'key': 'name', 'name':'Assessment Test', 'dir' : 'asc', 'class' :'left aligned fourteen wide column'}],

  activeModel: Ember.observer('offset', 'limit', 'sort', 'dir','flagDelete','flagAdd', function () {
    var self = this;

    let client = this.get('model').id;

    this.get('store').query('assessment-test', {filter: {'patient': client}}, this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
      self.set('testModel', records.toArray());
    });
  }),

  filtertests: Ember.observer('query', 'queryPath', function () {

    var self=this;

    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^"+queryText);
    } else {
      this.set('regex', '');
    }

    let client = this.get('model').id;

    this.get('store').query('assessment-test', {filter: {'patient': client}}, this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
      self.set('testModel', records.toArray());
    });
    this.get('store').query('rehab-client-link',  {filter: {'patient': client}}).then((obj)=>{
          obj.forEach((rec) => {
            self.get("testModel").push(rec.get('assessmentTest'));
          })
    });

  }),

  init() {
    this._super(...arguments);
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    let self = this;
    let client = this.get('model').id;
    this.set('rehabclinetLink', Ember.A());

    this.get('store').query('rehab-client-link', {filter: {'id': client}}).then((obj)=>{

      obj.forEach((rec) => {
        self.get("rehabclinetLink").pushObject(rec);
        self.get('store').findRecord('assessment-test', rec.get('assessmentTest').get('id')).then((asdf)=>{
          rec.set('assessmentTest', asdf);
        });
      });


    });

    this.get('store').query('assessment-test', {filter: {'patient': client}}, this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
    //  console.log(this.get('testModel'));
      self.set('testModel', records.toArray());
    });
    // this.get('store').query('rehab-client-link',  {filter: {'id': client}}).then((obj)=>{
    //   obj.forEach((rec) => {
    //     self.get('store').findRecord('assessment-test', rec.get('assessmentTest').get('id')).then((asdf)=>{
    //       self.get("testModel").pushObject(asdf);
    //     });
    //   });
    // });
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
  getCur: function (curas) {

  },

  bindScrolling: function() {
    var self = this;
    var onScroll = function() {
      Ember.run.debounce(self, self.scrolled, 500);
    };
    Ember.$("#myWindow").bind('touchmove', onScroll);
    Ember.$("#myWindow").bind('scroll', onScroll);
  },

  unbindScrolling: function() {
    Ember.$("#myWindow").unbind('scroll');
    Ember.$("#myWindow").unbind('touchmove');
  },

  actions: {
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
    },
  }

});
