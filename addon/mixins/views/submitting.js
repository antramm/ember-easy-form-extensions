import Ember from 'ember';

export default Ember.Mixin.create(
  Ember.Evented, {

  cancelClicked: false,
  formSubmitted: Ember.computed.alias('controller.formSubmitted'),

  actions: {

    cancel: function() {
      this.setProperties({
        cancelClicked: true,
        formSubmitted: true
      });

      this._eventHandler('cancel');
    },

    destroy: function() {
      this.set('formSubmitted', true);

      this._eventHandler('destroy');
    },

  },

  /* Autofocus on the first input */

  autofocus: Ember.on('didInsertElement', function() {
    var input = this.$().find('input').first();

    if (!Ember.$(input).hasClass('datepicker')) {
      input.focus();
    }
  }),

  /* Show validation errors on submit click */

  submit: function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.set('formSubmitted', true);
    this.trigger('submission');

    this._eventHandler('submit');
  },

  resetForm: Ember.on('willInsertElement', function() {
    this.set('formSubmitted', false);
  }),

  /* Private methods */

  _eventHandler: function(type) {
    var controller = this.get('controller');
    var methodName = type + 'Handler';
    var handler = this[methodName];
    var controllerMethod, handlerPromise;

    /* If event is submit, controller method is renamed */

    type = type === 'submit' ? 'validateAndSave' : type;
    controllerMethod = controller[type];

    Ember.assert(
      'You need to specify a ' + type + ' method on this view\'s controller',
      controllerMethod && Ember.typeOf(controllerMethod) === 'function'
    );

    /* Don't use controller[type] variable so we keep scope */

    /* Else, if handler exists, resolve the promise then call
    the method on the controller */

    if (handler) {
      Ember.assert(
        methodName + '() must be a function',
        Ember.typeOf(handler) === 'function'
      );

      handlerPromise = handler();

      if (!handlerPromise.then) {
        Ember.assert(
          'handler() must return a promise (e.g. return new Ember.RSVP.Promise(...))'
        );
      }

      handlerPromise.then(function() {
        controller[type]();
      });

    /* Else, just call the method on the controller */

    } else {
      controller[type]();
    }

  },

});
