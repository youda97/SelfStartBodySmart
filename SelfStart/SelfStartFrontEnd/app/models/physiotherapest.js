import DS from 'ember-data';

export default DS.Model.extend({
    ID: DS.attr(),
    familyName: DS.attr(),
    givenName: DS.attr(),
    encryptedPassword: DS.belongsTo('password'),
    email: DS.attr(),
    dateHired: DS.attr("Date"),
    dateFired: DS.attr("Date"),
    phoneNumber: DS.attr(),
    gender: DS.attr(),
    treatment: DS.attr(),
    account: DS.attr(),
    success: DS.attr(),
    appointments: DS.hasMany('appointment' , { async: true })
});
