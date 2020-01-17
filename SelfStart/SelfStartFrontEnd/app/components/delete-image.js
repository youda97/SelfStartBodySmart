import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({
  DS: Ember.inject.service('store'),
  flagDelete: null,

  modalName : Ember.computed(function() {
    return 'delete-image' + this.get('ID');
  }),

  actions: {
    openModal: function () {
      // console.log(this.get('modalName'));
      Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        onDeny: () => {
          return true;
        },

        onApprove: () => {

          let image = this.get('DS').peekRecord('image', this.get('ID'));

          image.destroyRecord().then(()=>{
            if (this.get('flagDelete')=== true)
              this.set('flagDelete', false);
            else
              this.set('flagDelete', true);
            return true;
          });
        }
      }).modal('show');
    },
  }

});
