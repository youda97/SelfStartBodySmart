import Route from '@ember/routing/route';
import RSVP from 'rsvp';
export default Route.extend({
  assessmentModel(){
     return this.store.findAll('assessment-test')
  }
});
