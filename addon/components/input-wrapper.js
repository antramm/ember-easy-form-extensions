import defaultFor from '../utils/default-for';
import Ember from 'ember';
import layout from '../templates/components/input-wrapper';
import toWords from '../utils/to-words';
import WalkViews from '../mixins/views/walk-views';

var typeOf = Ember.typeOf;
var run = Ember.run;

export default Ember.Component.extend(
  WalkViews, {

  inputPartial: 'form-inputs/default',
  layout: layout,
  modelPath: Ember.computed.oneWay('parentView.modelPath'),
  property:  Ember.computed.oneWay('valueBinding._label'),
  shouldShowError: false,
  value: null,

  classNameBindings: [
    'easyForm.inputWrapperClass',
    'showValidity:control-valid'
  ],

  /* Input attributes */

  collection: null,
  optionValuePath: null,
  optionLabelPath: null,
  selection: null,
  value: null,
  multiple: null,
  name: Ember.computed.oneWay('property'),
  placeholder: null,
  prompt: null,
  disabled: null,

  cleanProperty: Ember.computed('property', 'modelPath',
    function() {
      return this.get('property').replace(this.get('modelPath'), '');
    }
  ),

  formInputPartial: Ember.computed('type', function() {
    var directory = this.get('easyForm.formInputsDirectory');

    return directory + '/' + this.get('type');
  }),

  inputId: Ember.computed(function() {
    return this.get('elementId') + '-input';
  }),

  label: Ember.computed('property', function() {
    var property = defaultFor(this.get('cleanProperty'), '');

    return toWords(property);
  }),

  type: Ember.computed(function() {
    var property = this.get('cleanProperty');
    var type, value;

    if (property.match(/password/)) {
      type = 'password';
    } else if (property.match(/email/)) {
      type = 'email';
    } else if (property.match(/url/)) {
      type = 'url';
    } else if (property.match(/color/)) {
      type = 'color';
    } else if (property.match(/^tel/) || property.match(/^phone/)) {
      type = 'tel';
    } else if (property.match(/search/)) {
      type = 'search';
    } else {
      value = this.get('value');

      if (typeOf(value) === 'number') {
        type = 'number';
      } else if (typeOf(value) === 'date') {
        type = 'date';
      } else if (typeOf(value) === 'boolean') {
        type = 'checkbox';
      }
    }

    return type;
  }),

  actions: {
    showError: function() {
      this.set('shouldShowError', true);
    },
  },

  listenForSubmit: Ember.on('init', function() {
    this.get('formView').on('submission', function() {
      this.send('showError');
    }.bind(this));
  }),

});
