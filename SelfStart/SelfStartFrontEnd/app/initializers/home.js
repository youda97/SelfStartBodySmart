export function initialize(application) {
   application.inject('component', 'home', 'service:home');
}

export default {
  name: 'home',

  initialize
};
