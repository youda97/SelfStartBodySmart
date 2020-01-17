import Route from '@ember/routing/route';


//use get mehod to find all model that is subset of rehabilitationplan
export default Route.extend({
  model() {
    return this.store.findAll('rehabilitationplan');
  },
  afterModel(){
    return this.store.findAll('exercise-list')
  }
});
