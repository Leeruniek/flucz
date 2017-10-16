'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.connect = connect;
exports.getCursors = getCursors;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowEqual = require('fbjs/lib/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _wrapperValidator = require('./lib/wrapper-validator');

var _wrapperValidator2 = _interopRequireDefault(_wrapperValidator);

var _index = require('./index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function connect(_options) {
  var options = _options.cursors === undefined ? { cursors: _options } : _options;
  return function (Component) {
    return wrapperConstructor(Component, options);
  };
}

function getCursors(cursors) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof cursors === 'function') {
    return cursors.call(null, props);
  } else {
    return cursors;
  }
}

var wrapperConstructor = function wrapperConstructor(Component, options) {
  var _class, _temp;

  var cursors = options.cursors,
      _options$propTypes = options.propTypes,
      propTypes = _options$propTypes === undefined ? {} : _options$propTypes,
      child = options.child,
      defaultProps = options.defaultProps;

  var validator = new _wrapperValidator2.default(Component, options);
  validator.validate();

  var childPropTypes = Component.propTypes || options.childPropTypes;
  var componentName = Component.dislayName || Component.name;

  var wrapperPropTypes = _extends({}, childPropTypes, propTypes);
  // Prune propTypes derived from state
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.values(getCursors(cursors, defaultProps))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      delete wrapperPropTypes[prop];
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

  return _temp = _class = function (_React$Component) {
    _inherits(Wrapper, _React$Component);

    function Wrapper(props) {
      _classCallCheck(this, Wrapper);

      var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props));

      var tree = (0, _index.getTree)();
      _this._cursors = getCursors(cursors, props);
      _this._watcher = tree.watch(_this._cursors);
      _this.state = _this._watcher.get();
      return _this;
    }

    _createClass(Wrapper, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        this._watcher.on('update', function () {
          return _this2.setState(_this2._watcher.get());
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this._cursors = getCursors(cursors, nextProps);
        this._watcher.refresh(this._cursors);
        this.setState(this._watcher.get());
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._watcher.release();
        delete this._watcher;
      }
    }, {
      key: 'render',
      value: function render() {
        var propsFromState = _objectWithoutProperties(this.state, []);

        var props = _extends({}, propsFromState, this.props);

        for (var _prop in propTypes) {
          if (Object.keys(childPropTypes).indexOf(_prop) === -1) {
            delete props[_prop];
          }
        }

        return _react2.default.createElement(Component, props);
      }
    }]);

    return Wrapper;
  }(_react2.default.Component), _class.propTypes = wrapperPropTypes, _class.displayName = componentName + '-Connector', _class._isWrapper = true, _class._child = Component, _class._original = Component._isWrapper ? Component._original : Component, _temp;
};