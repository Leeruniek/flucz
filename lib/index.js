'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = undefined;
exports.init = init;
exports.getTree = getTree;
exports.dispatch = dispatch;

var _wrapper = require('./wrapper.js');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _wrapper.connect;
  }
});
exports.storeSwitch = storeSwitch;

var _baobab = require('baobab');

var _baobab2 = _interopRequireDefault(_baobab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducers = []; /*
                    * Experimental flux implementation based on redux patters
                    */

var tree = void 0;

function reduce(tree, action) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  if (process.env.NODE_ENV === 'development') {
    console.debug(action)
  }

  // iterate over all reducers and find the one which does not throw the error and call it
  try {
    for (var _iterator = reducers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _reduce = _step.value;
      _reduce.call(null, tree, action);
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

function init(_reducers) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  reducers = _reducers;

  tree = new _baobab2.default(initialState);

  if (process.env.NODE_ENV === 'development') {
    //https://github.com/Yomguithereal/baobab#events
    tree.on('update', function(e) {
      if (!(e && e.data && e.data.currentData)) {
        return
      }

      const currentData = e.data.currentData
      const previousData = e.data.previousData
      const paths = e.data.paths
      const differences = []
      const deepValue = (o, p) => p.reduce((a, v) => a[v], o)

      try {
        paths.forEach(path => {
          differences.push({
           'prev': deepValue(previousData, path),
           'next': deepValue(currentData, path)
          })
        })
      } catch (err) {
        console.debug('Could not access path', err)
      }
      console.debug({
        'Diff': differences,
        ...e.data
      })
    })
  }

  // Expose the state tree in development
  if (process.env.NODE_ENV === 'development') {
    window.stateTree = tree;
  }
  reduce(tree, { type: 'INIT' });
}

function getTree() {
  return tree;
}

function dispatch(action) {
  reduce(tree, action);
}
function storeSwitch(_ref) {
  var map = _ref.map,
      cursor = _ref.cursor,
      action = _ref.action;
  var type = action.type,
      payload = action.payload;

  var handler = map[type];
  if (typeof handler === 'function') {
    handler.call(null, cursor, payload);
  }
}
