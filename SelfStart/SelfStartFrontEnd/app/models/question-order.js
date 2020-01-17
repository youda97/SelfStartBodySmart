import DS from 'ember-data';

export default DS.Model.extend({
    order: DS.attr('Number'),
    question: DS.belongsTo('question'),
    form: DS.belongsTo('form')
});
