!function(t){"use strict";var e=t.document,n=function(t){return"function"==typeof t},i=function(t){return"boolean"==typeof t},r=function(t){return"object"==typeof t},s=function(t){return"undefined"!=typeof t},o=function(t){return null===typeof t},a=function(t){return"number"==typeof t},u=function(t){return"[object Array]"===Object.prototype.toString.call(t)},l=function(t){return"string"==typeof t},c=function(t,n){var i;return"#"===n.charAt(0)?(i=e.getElementById(n.slice(1,n.length)),{type:1,dom:i}):"."===n.charAt(0)?(i=t.getElementsByClassName(n.slice(1,n.length)),{type:2,dom:i}):(i=t.getElementsByTagName(n),{type:3,dom:i})},f=function(t,e,n,i){t.addEventListener?t.addEventListener(e,n,i):t.attachEvent?t.attachEvent("on"+e,n):t["on"+e]=n},h={el:null,html:function(t){return t?(this.el.innerHTML=t,this):this.el.innerHTML},append:function(t){if(l(t)){var n=e.createElement("div");n.innerHTML=t,this.el.appendChild(n.firstChild)}else 1===t.nodeType&&this.el.appendChild(t);return this},attr:function(t,e){return t&&e?(this.el.setAttribute(t,e),this):this.el.getAttribute(t)},hasClass:function(t){var e=new RegExp("(\\s|^)"+t+"(\\s|$)");return this.el.className.match(e)},addClass:function(t){return this.hasClass(t)||(this.el.className+=""+t),this},removeClass:function(t){if(this.hasClass(t)){var e=new RegExp("(\\s|^)"+t+"(\\s|$)");this.el.className=this.el.className.replace(e," ")}return this},css:function(t){if("object"==typeof t){for(var e in t)this.el.style[e]=t[e];return this}return this.el.currentStyle?this.el.currentStyle[t]:getComputedStyle(this.el,null)[t]},on:function(t,e){var n=function(t){var n=t||window.event,i={preventDefault:function(){n.preventDefault?n.preventDefault():n.returnValue=!1},stopPropagation:function(){n.stopPropagation?n.stopPropagation():n.cancelBubble=!0}};e.call(this.el,i)};return f(this.el,t,n),this}},d=function(){};d.prototype=h;var p=function(t){var e=new d;return e.el=t,e},m=function(t){var e=function(t,e,n){n(t,e)};return t.each=function(i){if(n(i)){var r,s=t.length;for(r=0;s>r;r++){var o=t[r];e(o,r,i)}}},t},y=function(t){if(!t)return p();if("function"==typeof t)return y.ready(t);var n=c(e,t),i=n.type,r=n.dom;return 1===i?p(r):2===i?m(r):3===i?m(r):void 0};y.ready=function(t){f(e,"DOMContentLoaded",t,!1),f(e,"load",t,!1)},y["static"]=function(t,e){if(s(y[t]))throw"the Function Name :"+t+" has defined";y[t]=e},y.extend=function(t,e){if(s(h[t]))throw"the Function Name :"+t+" has defined";h[t]=e},y["static"]("isFunc",n),y["static"]("isBool",i),y["static"]("isObj",r),y["static"]("isDefined",s),y["static"]("isNull",o),y["static"]("isNum",a),y["static"]("isArr",u),y["static"]("isStr",l),function(){y.extend("dom",function(t){if(!t)throw"this arguments is empty";if(l(t)){var n=c(e,t);if(1!==n.type)throw"this dom is not a single dom element";this.el=n.dom}else{if(1!==t.nodeType)throw"arguments are illegel, not dom object or string";this.el=t}return this}),y.extend("find",function(t){var e=c(this.el,t),n=e.type,i=e.dom;return 1===n?(this.el=i,this):m(i)}),y.extend("parent",function(){return this.el=this.el.parentNode,this})}(),t.Dom=y}(window);