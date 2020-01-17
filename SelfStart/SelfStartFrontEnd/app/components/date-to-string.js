import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({

  tagName: '',
  date: null,

  dateString: Ember.computed (function(){
    return this.get('date').toISOString().substring(0, 10);
  })

});
