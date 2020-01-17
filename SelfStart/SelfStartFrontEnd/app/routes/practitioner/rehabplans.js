import Route from '@ember/routing/route';
import RSVP from 'rsvp';

//use get mehod to find all model that is subset of rehabilitationplan
export default Route.extend({
  model() {
    return RSVP.hash({
      rehabPlan: this.store.findAll('rehabilitationplan'),
      assessmentTest: this.store.findAll('assessment-test'),
    });
  },
});
