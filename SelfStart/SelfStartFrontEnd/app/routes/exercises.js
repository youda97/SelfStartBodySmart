import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      exercise: this.store.findAll('exercise'),
      image: this.store.findAll('image')
    })
  },
  afterModel() {
    this.store.findAll('image');
  }
});
