export function initialize(application) {
   application.inject('component', 'doc', 'service:doc');
}

export default {
  name: 'doc',

  initialize
};
