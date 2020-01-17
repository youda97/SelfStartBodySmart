import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({
  store: Ember.inject.service(),

  formView: true,
  questionView:false,
  formState: "active",
  questionState: "",

  limit: 10,
  offset: 0,
  pageSize: 10,
  sort: 'givenName',
  dir:'',
  query: null,
  flagDelete: false,
  flagAdd: false,
  clientView: true,
  practView:false,
  adminView:false,
  modelAttributes: [{'key': 'name', 'name':'Form Title', 'dir' : 'asc', 'class' :'left aligned thirteen wide column'}],
  formsModel: [],
  INDEX: null,
  queryPath: 'name',
  scrolledLines: 0,

  activeModel: Ember.observer('offset', 'limit', 'sort', 'dir','flagDelete','flagAdd', function () {
    var self = this;

    this.get('store').query('form', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('formsModel', records.toArray());
    });
  }),

  filterpateints: Ember.observer('query', 'queryPath', function () {
    var self=this;

    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^"+queryText);
    } else {
      this.set('regex', '');
    }

    this.get('store').query('form', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
      self.set('formsModel', records.toArray());
    });
  }),

  init() {
    this._super(...arguments);
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    let self = this;

    this.get('store').query('form', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('formsModel', records.toArray());
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
    form(){
      this.set('formView', true);
      this.set('questionView', false);
      this.set('formState', "active");
      this.set('questionState', "");
    },
    question(){
      this.set('formView', false);
      this.set('questionView', true);
      this.set('formState', "");
      this.set('questionState', "active");
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
  }

});
