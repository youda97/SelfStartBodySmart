import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      gender: this.store.findAll('gender'),
      country:  this.store.findAll('country'),
      province: this.store.findAll('province'),
      admin: this.store.findAll('administrator')
    })
  },
});
