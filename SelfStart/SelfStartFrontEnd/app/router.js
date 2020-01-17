import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', {path: '/'});
  //this.route('patients');
  this.route('rehabplans');
  this.route('admin', function() {
    this.route('admin-welcome', {path: '/'});
    this.route('manage-accounts');
    this.route('manage-selections');
    this.route('accounts');
    this.route('forms');
    this.route('new-form');
    // this.route('view-form');
    this.route('edit-form', { path: '/forms/:form_id'});
  });
  //this.route('questions');
  this.route('forms');
  //this.route('province');
  //this.route('city');
  //this.route('marital-status');
  this.route('new-rehabplans');
  //this.route('physiotherapists');
  //this.route('new-physiotherapist');
  //this.route('update-physiotherapist',{ path: 'physiotherapist/:physiotherapest_id'});
  this.route('formDisplay');
  //this.route('update-patient', { path: 'patient/:patient_id'});
  //this.route('new-patient');
  this.route('appointment');
  //this.route('patient-file');
  this.route('exercises');
  this.route('images');
  this.route('register');
  this.route('dashboard');
  this.route('message');
  this.route('practitioner', function() {
    this.route('physio-welcome', {path: '/'});
    this.route('clients');
    this.route('client-file', { path: '/clients/:patient_id'});
    this.route('rehabplans');
    this.route('new-rehabplans');
    this.route('assessment-display');
    this.route('appointment');
    this.route('display-reports');
    this.route('edit-menu', { path: '/rehabplans/:rehabilitationplan_id'});
    this.route('exercises');
    this.route('ask-a-therapist');
  });

  this.route('client', function() {
    this.route('welcome-client', {path: '/'});
    this.route('upload-photos');
    this.route('exercise-menu');
    this.route('resources');
    this.route('settings');
    this.route('upload-photos');
    this.route('appointment');
    this.route('exercises');
    this.route('view-rehabplan', { path: 'rehabplans/:rehabilitationplan_id'});
  });

});

export default Router;
