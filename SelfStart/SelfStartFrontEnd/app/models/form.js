import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    description: DS.attr(),
    author: DS.attr(),
    //answers:DS.hasMany('answer'),
    // questions: DS.hasMany('question'),
    questionOrder: DS.hasMany('question-order')
});
