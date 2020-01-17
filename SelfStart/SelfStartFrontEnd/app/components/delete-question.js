import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({
  DS: Ember.inject.service('store'),

  modalName: Ember.computed(function(){
    return 'Delete-question' + this.get('ID');
  }),

  flagDelete: null,

  actions: {
    openModal: function () {
      Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
        closeable: false,
        transition: 'fly down',
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          let self=this;

          this.get('DS').find('question', this.get('ID')).then((question) => {
            question.destroyRecord().then(() => {
              if (self.get('flagDelete')=== true)
                self.set('flagDelete', false);
              else
                self.set('flagDelete', true);
              return true;
            });
          })
        }
      })
        .modal('show');
    },
  }
});
