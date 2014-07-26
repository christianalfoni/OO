(function (global) {


  var setMethodValuesTo = function (obj, props) {
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        if (typeof props[prop] === 'function') {
          obj[prop] = props[prop];
        }
      } 
    }
  };
  
  var setPropertyValuesTo = function (obj, props, creatingPrototype) {
    for (var prop in props) {
      if (!creatingPrototype && prop.match(/^_OO\./)) {
        continue;
      }
      if (props.hasOwnProperty(prop)) {
        if (props[prop] instanceof Array) {
          obj[prop] = props[prop].slice(0);
        } else if (typeof props[prop] === 'object' && props[prop] !== null) {
          obj[prop] = setPropertyValuesTo({}, props[prop], true);
        } else if (typeof props[prop] !== 'function' || (typeof props[prop] === 'function' && creatingPrototype)) {
          obj[prop] = props[prop];
        }
      } 
    }
    return obj;
  };

  var base = {
    define: function () {
      var props = arguments.length === 2 ? arguments[1] : arguments[0];
      var name = arguments.length === 2 && typeof arguments[0] === 'string' ? arguments[0] : 'Unknown';

      var obj = Object.create(this.definedPrototype);
      obj.name = name;
      obj.prototype = {
        '_OO.instanceOf': [name]
      };
      
      setPropertyValuesTo(obj.prototype, props, true);
      setPropertyValuesTo(obj.prototype, this.instancePrototype, true);
      return obj;
      
    },
    definedPrototype: {
      create: function (instanceProps, options) {

        options = options || {
          inherit: false
        };
        instanceProps = instanceProps || {};

        var obj = Object.create(this.prototype);

        if (!options.inherit) {
          setPropertyValuesTo(obj, this.prototype); 
        }
        
        setPropertyValuesTo(obj, instanceProps, true);
       
        if (obj.init) {
          obj.init(instanceProps);
        }

        return obj;

      },
      extend: function () {
        var props = arguments.length === 2 ? arguments[1] : arguments[0];
        var name = arguments.length === 2 && typeof arguments[0] === 'string' ? arguments[0] : 'Unknown';
        var obj = Object.create(base.definedPrototype);
        this.prototype['_OO.instanceOf'].push(name);
        obj.prototype = setPropertyValuesTo({}, this.prototype, true);
        setPropertyValuesTo(obj.prototype, props, true);
        return obj;
      }
    },
    instancePrototype: {
      init: function () {},
      merge: function (props) {
        props = props || {};
        for (var prop in props) {
          if (props.hasOwnProperty(prop)) {
            this[prop] = props[prop];
          }
        }
        return this;
      },
      is: function (name) {
        console.log(this);
        return this['_OO.instanceOf'].indexOf(name) >= 0;
      }
    }
  };
  
  global.OO = Object.create(base);
  
}(window));