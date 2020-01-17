import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  primaryKey: '_id',
  attrs: {
    account: { embedded: 'always' },
    //payments: { embedded: 'always' }
  }
});
