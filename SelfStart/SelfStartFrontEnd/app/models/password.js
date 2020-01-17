import DS from 'ember-data';

export default DS.Model.extend({
    email: DS.attr(),
    salt: DS.attr(),
    encryptedPassword: DS.attr(),
    passwordMustChanged : DS.attr(),
    passwordReset: DS.attr(),
    admin: DS.belongsTo('administrator'),
    practitioner: DS.belongsTo('physiotherapest'),
    client: DS.belongsTo('patient'),
    firstUserInfoRegister: DS.attr(),
    newPass: DS.attr(),
    updatePassword: DS.attr(),
});
