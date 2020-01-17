import Component from '@ember/component';
import Ember from "ember";
// import $ from 'jquery';

export default Component.extend({
  store: Ember.inject.service(),

  citySelected: false,

  genderSelected: false,
  countrySelected: false,
  provinceSelected: false,
  quoteSelected: false,
  model: null,

  provinceDelete: false,
  provinceAdd: false,
  countryDelete: false,
  countryAdd: false,
  genderDelete: false,
  genderAdd: false,


  limit: 10,
  offset: 0,
  pageSize: 10,
  sort: 'name',
  dir:'',
  query: null,
  modelAttributes:

    [{'key': 'name', 'name':'Name', 'dir' : 'asc', 'class' :'left aligned thirteen wide column'}],

  countriesModel: [],
  INDEX: null,
  queryPath: 'name',
  scrolledLines: 0,

  activeModel: Ember.observer('offset', 'limit', 'sort', 'dir', 'provinceDelete', 'provinceAdd', 'countryDelete', 'countryAdd', 'genderDelete', 'genderAdd', function () {
    var self = this;

    this.get('store').query('country', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('countriesModel', records.toArray());

    });
  }),

  filtercountries: Ember.observer('query', 'queryPath', function () {
    let queryText = this.get('query');
    if (queryText !== null && queryText.length > 0) {
      this.set('regex', "^"+queryText);
    } else {
      this.set('regex', '');
    }

    this.get('store').query('country', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
      this.set('countriesModel', records.toArray());
    });
  }),

  init() {
    this._super(...arguments);
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    let self = this;
    this.get('store').query('country', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('countriesModel', records.toArray());

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
    console.log("scrolled");
    if (this.get('scrolledLines') < Ember.$("#myWin").scrollTop()) {
      this.set('scrolledLines', Ember.$("#myWin").scrollTop());
      this.set('limit', this.get('limit') + 10);
    }
  },



  bindScrolling: function() {
    var self = this;
    // var onScroll = function() {
    //   console.log("bottom");
    //   Ember.run.debounce(self, self.scrolled, 500);
    // };

    //Ember.$("#myWin").bind('touchmove', onScroll);
    Ember.$("#myWin").bind('scroll', function(){
      console.log("bottom");
      Ember.run.debounce(self, self.scrolled, 500);
    });

  },

  unbindScrolling: function() {
    //Ember.$("#myWin").unbind('scroll');
    //Ember.$("#myWin").unbind('touchmove');
  },

  actions: {
    genderSelect: function(){
      this.set('genderSelected', true);
      this.set('countrySelected', false);
      this.set('provinceSelected', false);
      this.set('citySelected', false);

      this.set('quoteSelected', false);
    },
    countrySelect: function(){
      this.set('countrySelected', true);
      this.set('genderSelected', false);
      this.set('provinceSelected', false);
      this.set('citySelected', false);

      this.set('quoteSelected', false);
    },
    provinceSelect: function(){
      this.set('provinceSelected', true);
      this.set('genderSelected', false);
      this.set('countrySelected', false);

      this.set('citySelected', false);
      this.set('quoteSelected', false);
    },
    citySelect: function(){
      this.set('provinceSelected', false);
      this.set('genderSelected', false);
      this.set('countrySelected', false);
      this.set('citySelected', true);

      this.set('quoteSelected', false);
    },
    quoteSelect: function(){
      this.set('provinceSelected', false);
      this.set('genderSelected', false);
      this.set('countrySelected', false);
      this.set('quoteSelected', true);
    },
    submit(){
      let self = this;
      var administrator = this.get("store").createRecord('administrator', {
        email: "root",
        message: null
      });
      console.log(administrator);
      administrator.save().then((admin) => {
        if(!admin.get("success")) {
          admin.destroyRecord().then(a => {
            console.log("Deleted");
            self.get('store').query('administrator', {filter: {"email": "root"}}).then(function (rec) {
              rec.forEach((r)=>{
                console.log(r);
                r.set('message', self.get('message') );
                r.save()
                
              })
            });
          });
        } else {
          self.get('store').query('administrator', {filter: {"email": "root"}}).then(function (rec) {
            rec.forEach((r)=>{
              console.log(r);
              r.set('message', self.get('message') );
              r.save()
              
            })
          });
        }
      });
     
     

      // this.get('store').findAll('administrator').then((rec) =>{
      //   rec.forEach((r)=>{
      //     console.log(r);
      //     r.set('message', this.get('message') );
      //     r.save()
      //   })
      // });
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
