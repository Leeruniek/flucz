'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validator = function () {
  function Validator(Component, options) {
    _classCallCheck(this, Validator);

    this.Component = Component;
    this.options = options;
  }

  _createClass(Validator, [{
    key: 'validate',
    value: function validate() {
      var Component = this.Component,
          options = this.options;

      if (typeof Component.prototype.render === 'function') {
        this.validateNormalComponent();
      } else {
        this.validateStatelessComponent();
      }
      // Validate cursor definition
      this.validateCursorsDefinition();
    }
  }, {
    key: 'name',
    value: function name() {
      var Component = this.Component;

      return Component.prototype instanceof _react2.default.Component ? Component.displayName || '<displayName missing>' : Component.name || '<anonymous function>';
    }
  }, {
    key: 'validateStatelessComponent',
    value: function validateStatelessComponent() {
      var childPropTypes = this.options.childPropTypes;

      (0, _invariant2.default)((typeof childPropTypes === 'undefined' ? 'undefined' : _typeof(childPropTypes)) === 'object', 'You must specify childPropTypes in the connect ' + 'for all wrapped stateless components. Check: %s', this.name());
    }
  }, {
    key: 'validateNormalComponent',
    value: function validateNormalComponent() {
      var Component = this.Component;

      (0, _invariant2.default)(_typeof(Component.propTypes) === 'object', 'You must specify propTypes for all wrapped components. Check: %s', this.name());
    }
  }, {
    key: 'validateCursorsDefinition',
    value: function validateCursorsDefinition() {
      var cursors = this.options.cursors;


      (0, _invariant2.default)(typeof cursors === 'function' || (typeof cursors === 'undefined' ? 'undefined' : _typeof(cursors)) === 'object', 'Cursor definition can be either a function of props that ' + 'returns a cursor object, or a plain cursor object. Check: %s', this.name());

      if (typeof cursors === 'function') {
        this.validateDynamicCursors();
      } else {
        this.validateCursorsObject(cursors);
      }
    }
  }, {
    key: 'validateDynamicCursors',
    value: function validateDynamicCursors() {
      var options = this.options,
          Component = this.Component;
      var cursors = options.cursors,
          defaultProps = options.defaultProps;

      var defaultCursors = void 0;

      try {
        defaultCursors = cursors(defaultProps || {});
      } catch (e) {
        (0, _invariant2.default)((typeof defaultProps === 'undefined' ? 'undefined' : _typeof(defaultProps)) === 'object', 'The cursors function is throwing an error with the defaultProps. Check: %s', this.name());
      }

      this.validateCursorsObject(defaultCursors);
    }
  }, {
    key: 'validateCursorsObject',
    value: function validateCursorsObject(cursorsObject) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(cursorsObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          var path = cursorsObject[key];
          (0, _invariant2.default)(key.indexOf('.') === -1, 'All keys defined in cursors must not contain dots. Check "%s" of %s.', key, this.name());

          (0, _invariant2.default)(path instanceof Array && path.length >= 1, 'The values of the cursors object must be valid path arrays. Check "%s" of %s', key, this.name());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Validator;
}();

exports.default = Validator;