import Component from '@ember/component';

export default Component.extend({
    DS: Ember.inject.service('store'),

    assessmentModel: Ember.computed(function(){
        return this.get('DS').findAll('assessment-test');
      }),

      actions: {
        generateReport() {
            window.print();
        }
      }
});
