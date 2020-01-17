import Component from '@ember/component';
import { inject } from '@ember/service';
import Ember from "ember";

export default Component.extend({
  store: Ember.inject.service(),
  tableView: true,
  cardView: false,
  tableState: "active",
  cardState: "",
  play: false,


  limit: 10,
  offset: 0,
  pageSize: 10,
  sort: 'name',
  dir:'',
  query: null,
  flagAdd: false,
  flagEdit: false,
  flagDelete: false,

  modelAttributes:
    [{'key': 'name', 'name': 'Name', 'dir': 'asc', 'class': 'left aligned seven wide column'},
      {'key': 'sets', 'name': 'Sets', 'dir': '', 'class': 'left aligned two wide column'},
      {'key': 'reps', 'name': 'Reps', 'dir': '', 'class': 'left aligned two wide column'},
      {'key': 'duration', 'name': 'Duration', 'dir': '', 'class': 'left aligned three wide column'}],

  searchAttributes:
    [{'key': 'name', 'name': 'Name', 'dir': '', 'class': 'left aligned seven wide column'}],

  exercisesModel: [],
  INDEX: null,
  queryPath: 'name',
  scrolledLines: 0,

  activeModel: Ember.observer('offset', 'limit', 'sort', 'dir', 'flagAdd', 'flagEdit', 'flagDelete', function () {
    console.log(this.get('flagAdd'));
    var self = this;

    this.get('store').findAll('image');
    this.get('store').query('exercise', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {
      self.set('exercisesModel', records.toArray());
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

    this.get('store').findAll('image');
    this.get('store').query('exercise', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then((records) => {
      self.set('exercisesModel', records.toArray());
    });

  }),

  init() {
    this._super(...arguments);
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    let self = this;

    this.get('store').findAll('image');

    this.get('store').query('exercise', this.getProperties(['offset', 'limit', 'sort', 'dir', 'queryPath', 'regex'])).then(function (records) {

      self.set('exercisesModel', records.toArray());
    });
  },

  didInsertElement: function() {

    this._super(...arguments);
    this.bindScrolling();
  },
  willRemoveElement: function() {
    console.log("sds");
    this._super(...arguments);
    this.unbindScrolling();
  },
  scrolled: function() {

    if (this.get('scrolledLines') < Ember.$("#cards").scrollTop()) {
      this.set('scrolledLines', Ember.$("#cards").scrollTop());
      this.set('limit', this.get('limit') + 10);
    }
  },

  bindScrolling: function() {

    var self = this;
    var onScroll = function() {
      Ember.run.debounce(self, self.scrolled, 500);
    };
    Ember.$("#cards").bind('touchmove', onScroll);
    Ember.$("#cards").bind('scroll', onScroll);
  },

  unbindScrolling: function() {
    console.log("sds");
    Ember.$("#cards").unbind('scroll');
    Ember.$("#cards").unbind('touchmove');
  },



  actions: {
    table: function() {
      this.set("tableState", "active");
      this.set("cardState", "");
      this.set("tableView", true);
      this.set("cardView", false);

    },

    card: function() {
      this.set("tableState", "");
      this.set("cardState", "active");
      this.set("tableView", false);
      this.set("cardView", true);
    },

    play: function(Exercise){
      this.set("play", true);
      Exercise.set("play", true);
      // exercise.get("play")
      // console.log(document.getElementById(index));

    },

    pause: function(Exercise) {
      Exercise.set("play", false);
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
