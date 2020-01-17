import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      gender: this.store.findAll('gender'),
      country:  this.store.findAll('country').then(rec => rec.sortBy('name')),
      city: this.store.findAll('city'),
      province: this.store.findAll('province').then(rec => rec.sortBy('name'))
    })
  },
});
