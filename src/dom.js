(function(win) {
  'use strict';

  var doc = win.document;
  
  // 类型判断
  var isFunc = function(o) { return typeof o === 'function'; };
  var isBool = function(o) { return typeof o === 'boolean'; };
  var isObj = function(o) { return typeof o === 'object'; };
  var isDefined = function(o) { return typeof o !== 'undefined'; };
  var isNull = function(o) { return typeof o === null; };
  var isNum = function(o) { return typeof o === 'number'; };
  var isArr = function(o) { return Object.prototype.toString.call(o) === '[object Array]'; };
  var isStr = function(o) { return typeof o === 'string'; };
  
  // 类选择器,只支持id, class, tag的选择
  var domSelect = function(context, str) {
    var doms;
    if (str.charAt(0) === '#') {
      doms = doc.getElementById(str.slice(1, str.length));
      return {type: 1, dom: doms};
    } else if (str.charAt(0) === '.' ) {
      doms = context.getElementsByClassName(str.slice(1, str.length));
      return {type: 2, dom: doms};
    } else {
      doms = context.getElementsByTagName(str);
      return {type: 3, dom: doms};
    }
  };
  
  // 事件绑定
  var addEvent = function(obj, eventName, cbFn, isCapture) {
    if (obj.addEventListener) { // ie9以上支持，chrome, safari, ff，this绑定的是obj
      obj.addEventListener(eventName, cbFn, isCapture);
    } else if (obj.attachEvent) { // ie6-8, this绑定的是全局
      obj.attachEvent('on' + eventName, cbFn);
    } else {
      obj['on' + eventName] = cbFn;
    }
  };
  
  // 封装了对dom对象的处理功能
  var handleSrc = {
    // 原生的对象
    el: null,

    html: function(text) {
      if(text) {
        this.el.innerHTML = text;
        return this;
      } else {
        return this.el.innerHTML;
      }
    },
    
    append: function(child) {
    	if (isStr(child)) {
    		var can = doc.createElement('div');
    		can.innerHTML = child;
    		this.el.appendChild(can.firstChild);
    	} else if (child.nodeType === 1) {
    		this.el.appendChild(child);
    	}
    	return this;
    },

    attr: function(k, v) {
      if (k && v) {
        this.el.setAttribute(k, v);
        return this;
      } else {
        return this.el.getAttribute(k);
      }
    },

    hasClass: function(className) {
      var regex = new RegExp('(\\s|^)' + className + '(\\s|$)');
      return this.el.className.match(regex);
    },

    addClass: function(className) {
      if (!this.hasClass(className)) {
        this.el.className += '' + className;
      }
      return this;
    },

    removeClass: function(className) {
      if (this.hasClass(className)) {
        var regex = new RegExp('(\\s|^)' + className + '(\\s|$)');
        this.el.className = this.el.className.replace(regex, ' ');
      }
      return this;
    },

    css: function(cssObj) {

      if (typeof cssObj === 'object') {
        for (var i in cssObj) {
          this.el.style[i] = cssObj[i];
        }

        return this;
      } else {
        // currentStyle兼容IE获取计算后的CSS样式值，getComputeStyle是标准获取计算后的CSS值
        return this.el.currentStyle ? this.el.currentStyle[cssObj] : getComputedStyle(this.el, null)[cssObj];
      }

    },

    on: function(eventName, cb) {

      var cbWrap = function(event) {
        var e = event || window.event;

        // 事件操作封装
        var eventObj = {

          preventDefault: function() {
            if (e.preventDefault) {
              e.preventDefault(); // 标准
            } else {
              e.returnValue = false; //IE 
            }
          },

          stopPropagation: function() {
            if (e.stopPropagation) {
              e.stopPropagation();
            } else {
              e.cancelBubble = true;
            }
          }
        };

        cb.call(this.el, eventObj);
      };

      addEvent(this.el, eventName, cbWrap);

      return this;
    }
  };
  
  var DomHandler = function() {};
  
  DomHandler.prototype = handleSrc;
  
  // 单个元素可以执行的操作
  var singleDom = function(dom) {
    var domHandler = new DomHandler();
    domHandler.el = dom;
    
    return domHandler;
    
  };
  
  // 对于多个dom的只提供遍历方法
  var manyDoms = function(doms) {
    
    var eachDom = function(dom, i, handle) {
      handle(dom, i);
    };
    doms.each = function(handle) {
      if (!isFunc(handle)) {
        return;
      }

      var i;
      var len = doms.length;
      for (i = 0; i < len; i++) {
        var dom = doms[i];
        eachDom(dom, i, handle);
      }
    };
    
    return doms;
  };
  
  var Dom = function(id) {
    // 无参数，就返回一个空的singleDom对象，可以通过el(dom)方法来改变dom
    if (!id) { return singleDom(); }
    
    if (typeof id === 'function') {return Dom.ready(id); }
    
    var typeObj = domSelect(doc, id);
    var type = typeObj.type;
    var dom = typeObj.dom;
    if (type === 1) {
      return singleDom(dom);
    } else if (type === 2) {
      return manyDoms(dom);
    } else if (type === 3) {
      return manyDoms(dom);
    }
  };
  
  Dom.ready = function(cbFn) {
    addEvent(doc, 'DOMContentLoaded', cbFn, false);
    addEvent(doc, 'load', cbFn, false);
  };
  
  // 扩展静态方法
  Dom.static = function(funcName, func) {
    if (isDefined(Dom[funcName])) {
        throw 'the Function Name :' + funcName + ' has defined';
    } else {
      Dom[funcName] = func;
    }
  };
  
  // 扩展dom操作
  Dom.extend = function(funcName, func) {
    if (isDefined(handleSrc[funcName])) {
        throw 'the Function Name :' + funcName + ' has defined';
    } else {
      handleSrc[funcName] = func;
    }
  };

  // 以下是扩展的功能
  Dom.static('isFunc', isFunc);
  Dom.static('isBool', isBool);
  Dom.static('isObj', isObj);
  Dom.static('isDefined', isDefined);
  Dom.static('isNull', isNull);
  Dom.static('isNum', isNum);
  Dom.static('isArr', isArr);
  Dom.static('isStr', isStr);
  
  (function() {
     
    // 改变当前的dom
    Dom.extend('dom', function(newDom) {

      if (!newDom) { throw 'this arguments is empty'; }

      if (isStr(newDom)) {
        var domObj = domSelect(doc, newDom);

        if (domObj.type === 1) {
          this.el = domObj.dom;
        } else {
          throw 'this dom is not a single dom element';
        }
      } else if (newDom.nodeType === 1) {
        this.el = newDom;
      } else {
        throw 'arguments are illegel, not dom object or string';
      }

      return this;
    });

    // 查找当前元素下的类
    Dom.extend('find', function(id) {
      var typeObj = domSelect(this.el, id);
      var type = typeObj.type;
      var dom = typeObj.dom;

      if (type === 1) {
        this.el = dom;
        return this;
      } else {
        return manyDoms(dom);
      }
    });

    Dom.extend('parent', function() {
      this.el = this.el.parentNode;
      return this;
    });
    
  })();

  win.Dom = Dom;
})(window);