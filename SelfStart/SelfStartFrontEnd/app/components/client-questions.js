import Component from '@ember/component';
import Ember from "ember";

export default Component.extend({
    questionModel: [],
    store: Ember.inject.service(),

    init() {
        this._super(...arguments);
        let self = this;

        this.get('store').findAll('ask-physio').then(function (records) {
            self.set('questionModel', records.toArray());
        });
    },



    

});
