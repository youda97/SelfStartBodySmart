import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({
  DS: Ember.inject.service('store'),
  ImageIsAdding: false,

  model: Ember.computed(function(){
    return this.get('DS').findAll ('image');
  }),

  actions: {
    deleteImage: function (file) {
      file.destroyRecord();
    },
    addNewImage: function () {
      this.set('ImageIsAdding', true);
    }
  }
});
