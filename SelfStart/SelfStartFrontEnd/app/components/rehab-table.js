import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({
  store: Ember.inject.service(),

  limit: 10,
  offset: 0,
  pageSize: 10,
  sort: 'planName',
  dir:'',
  query: null,
  flagDelete: false,

  modelAttributes:

    [{'key': 'planName', 'name':'Plan Name', 'dir' : 'asc', 'class' :'left aligned five wide column'},
      {'key': 'physioID.givenName', 'name':'Author Name', 'dir' : '','class' :'left aligned five wide column'},
      {'key': 'date', 'name':'Date Created', 'dir' : '','class' :'left aligned four wide column'}],

  searchAttributes:

    [{'key': 'planName', 'name':'Plan Name', 'dir' : 'asc', 'class' :'left aligned five wide column'},
      {'key': 'physioID.givenName', 'name':'Author Name', 'dir' : '','class' :'left aligned five wide column'}],


  plansModel: [],
  INDEX: null,
  queryPath: 'planName',
  scrolledLines: 0,



  activeModel: Ember.observer('offset', 'limit', 'sort', 'dir','flagDelete', function () {
    var self = this;
    console.log(this.plansModel);
    this.get('store').query('rehabilitationplan', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('plansModel', records.toArray());

    });


  }),

  filterplans: Ember.observer('query', 'queryPath', function () {
    let self = this;

    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^"+queryText);
    } else {
      this.set('regex', '');
    }

    this.get('store').query('rehabilitationplan', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
      self.set('plansModel', records.toArray());
    });

  }),

  init() {
    this._super(...arguments);
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    let self = this;



 //   self.get('store').findAll('exercise-list');
  //  self.get('store').findAll('assessment-test');

    this.get('store').query('rehabilitationplan', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {





      self.set('plansModel', records.toArray());


    });



  },


  dateFormat: Ember.computed(function(date){
    console.log(date);
    var dateString = date.toISOString().substring(0, 10);
    return dateString;
  }),



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

  clientState: "active",
  practState: "",
  adminState: "",

  terminated: false,


  actions: {
    toggleDetail(ID) {

      if (this.get('isShowing') === ID)
        this.set('isShowing', null);
      else
        this.set('isShowing', ID);
    },

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

    loadNext: function () {
      this.set('offset', this.get('offset') + this.get('pageSize'));
    },

    loadPrevious: function () {
      if (this.get('offset') >= this.get('pageSize')) {

        this.set('offset', this.get('offset') - this.get('pageSize'));

      }
    },
  }
});
