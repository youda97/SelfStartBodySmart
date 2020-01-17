import DS from 'ember-data';

export default DS.Model.extend({
  // patient
  ID: DS.attr(),
  familyName: DS.attr(),
  skype: DS.attr(),
  givenName: DS.attr(),
  email: DS.attr(),
  encryptedPassword: DS.belongsTo('password'),
  streetName: DS.attr(),
  streetNumber: DS.attr('Number'),
  apartment: DS.attr('Number'),
  country:DS.attr(),
  province: DS.attr(),
  city: DS.attr(),
  dateOfBirth: DS.attr('Date'),
  healthCardNumber: DS.attr(),
  gender: DS.attr(),
  phoneNumber: DS.attr(),
  postalCode: DS.attr(),
  appointments: DS.hasMany('appointment', { async: true }),
  account: DS.attr(),
  transactions: DS.attr(),
  rehablink: DS.hasMany('rehab-client-link', { async: true }),
  success: DS.attr(),
  packages: DS.attr(),
  images:DS.hasMany('image')
});

