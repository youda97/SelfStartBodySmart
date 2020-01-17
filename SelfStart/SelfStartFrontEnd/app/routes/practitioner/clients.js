import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return  this.store.findAll('country').then(rec => rec.sortBy('name'))
  }
});
