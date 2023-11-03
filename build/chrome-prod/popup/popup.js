var IS_DEV_BUILD=false;
(()=>{(function(){"use strict";var O=window.Document.prototype.createElement,u=window.Document.prototype.createElementNS,L=window.Document.prototype.importNode,C=window.Document.prototype.prepend,$=window.Document.prototype.append,H=window.DocumentFragment.prototype.prepend,I=window.DocumentFragment.prototype.append,x=window.Node.prototype.cloneNode,N=window.Node.prototype.appendChild,P=window.Node.prototype.insertBefore,M=window.Node.prototype.removeChild,m=window.Node.prototype.replaceChild,v=Object.getOwnPropertyDescriptor(window.Node.prototype,"textContent"),b=window.Element.prototype.attachShadow,F=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),w=window.Element.prototype.getAttribute,S=window.Element.prototype.setAttribute,k=window.Element.prototype.removeAttribute,f=window.Element.prototype.getAttributeNS,j=window.Element.prototype.setAttributeNS,B=window.Element.prototype.removeAttributeNS,G=window.Element.prototype.insertAdjacentElement,tt=window.Element.prototype.insertAdjacentHTML,Et=window.Element.prototype.prepend,bt=window.Element.prototype.append,et=window.Element.prototype.before,nt=window.Element.prototype.after,ot=window.Element.prototype.replaceWith,rt=window.Element.prototype.remove,Ct=window.HTMLElement,V=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),it=window.HTMLElement.prototype.insertAdjacentElement,st=window.HTMLElement.prototype.insertAdjacentHTML,at=new Set;"annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" ").forEach(function(t){return at.add(t)});function lt(t){var e=at.has(t);return t=/^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/.test(t),!e&&t}var Nt=document.contains?document.contains.bind(document):document.documentElement.contains.bind(document.documentElement);function d(t){var e=t.isConnected;if(e!==void 0)return e;if(Nt(t))return!0;for(;t&&!(t.__CE_isImportDocument||t instanceof Document);)t=t.parentNode||(window.ShadowRoot&&t instanceof ShadowRoot?t.host:void 0);return!(!t||!(t.__CE_isImportDocument||t instanceof Document))}function J(t){var e=t.children;if(e)return Array.prototype.slice.call(e);for(e=[],t=t.firstChild;t;t=t.nextSibling)t.nodeType===Node.ELEMENT_NODE&&e.push(t);return e}function X(t,e){for(;e&&e!==t&&!e.nextSibling;)e=e.parentNode;return e&&e!==t?e.nextSibling:null}function K(t,e,n){for(var i=t;i;){if(i.nodeType===Node.ELEMENT_NODE){var o=i;e(o);var r=o.localName;if(r==="link"&&o.getAttribute("rel")==="import"){if(i=o.import,n===void 0&&(n=new Set),i instanceof Node&&!n.has(i))for(n.add(i),i=i.firstChild;i;i=i.nextSibling)K(i,e,n);i=X(t,o);continue}else if(r==="template"){i=X(t,o);continue}if(o=o.__CE_shadowRoot)for(o=o.firstChild;o;o=o.nextSibling)K(o,e,n)}i=i.firstChild?i.firstChild:X(t,i)}}function U(){var t=!(y==null||!y.noDocumentConstructionObserver),e=!(y==null||!y.shadyDomFastWalk);this.m=[],this.g=[],this.j=!1,this.shadyDomFastWalk=e,this.I=!t}function R(t,e,n,i){var o=window.ShadyDOM;if(t.shadyDomFastWalk&&o&&o.inUse){if(e.nodeType===Node.ELEMENT_NODE&&n(e),e.querySelectorAll)for(t=o.nativeMethods.querySelectorAll.call(e,"*"),e=0;e<t.length;e++)n(t[e])}else K(e,n,i)}function Lt(t,e){t.j=!0,t.m.push(e)}function xt(t,e){t.j=!0,t.g.push(e)}function Q(t,e){t.j&&R(t,e,function(n){return D(t,n)})}function D(t,e){if(t.j&&!e.__CE_patched){e.__CE_patched=!0;for(var n=0;n<t.m.length;n++)t.m[n](e);for(n=0;n<t.g.length;n++)t.g[n](e)}}function _(t,e){var n=[];for(R(t,e,function(o){return n.push(o)}),e=0;e<n.length;e++){var i=n[e];i.__CE_state===1?t.connectedCallback(i):z(t,i)}}function g(t,e){var n=[];for(R(t,e,function(o){return n.push(o)}),e=0;e<n.length;e++){var i=n[e];i.__CE_state===1&&t.disconnectedCallback(i)}}function E(t,e,n){n=n===void 0?{}:n;var i=n.J,o=n.upgrade||function(s){return z(t,s)},r=[];for(R(t,e,function(s){if(t.j&&D(t,s),s.localName==="link"&&s.getAttribute("rel")==="import"){var a=s.import;a instanceof Node&&(a.__CE_isImportDocument=!0,a.__CE_registry=document.__CE_registry),a&&a.readyState==="complete"?a.__CE_documentLoadHandled=!0:s.addEventListener("load",function(){var l=s.import;if(!l.__CE_documentLoadHandled){l.__CE_documentLoadHandled=!0;var c=new Set;i&&(i.forEach(function(p){return c.add(p)}),c.delete(l)),E(t,l,{J:c,upgrade:o})}})}else r.push(s)},i),e=0;e<r.length;e++)o(r[e])}function z(t,e){try{var n=e.ownerDocument,i=n.__CE_registry,o=i&&(n.defaultView||n.__CE_isImportDocument)?W(i,e.localName):void 0;if(o&&e.__CE_state===void 0){o.constructionStack.push(e);try{try{if(new o.constructorFunction!==e)throw Error("The custom element constructor did not produce the element being upgraded.")}finally{o.constructionStack.pop()}}catch(l){throw e.__CE_state=2,l}if(e.__CE_state=1,e.__CE_definition=o,o.attributeChangedCallback&&e.hasAttributes()){var r=o.observedAttributes;for(o=0;o<r.length;o++){var s=r[o],a=e.getAttribute(s);a!==null&&t.attributeChangedCallback(e,s,null,a,null)}}d(e)&&t.connectedCallback(e)}}catch(l){A(l)}}U.prototype.connectedCallback=function(t){var e=t.__CE_definition;if(e.connectedCallback)try{e.connectedCallback.call(t)}catch(n){A(n)}},U.prototype.disconnectedCallback=function(t){var e=t.__CE_definition;if(e.disconnectedCallback)try{e.disconnectedCallback.call(t)}catch(n){A(n)}},U.prototype.attributeChangedCallback=function(t,e,n,i,o){var r=t.__CE_definition;if(r.attributeChangedCallback&&-1<r.observedAttributes.indexOf(e))try{r.attributeChangedCallback.call(t,e,n,i,o)}catch(s){A(s)}};function ct(t,e,n,i){var o=e.__CE_registry;if(o&&(i===null||i==="http://www.w3.org/1999/xhtml")&&(o=W(o,n)))try{var r=new o.constructorFunction;if(r.__CE_state===void 0||r.__CE_definition===void 0)throw Error("Failed to construct '"+n+"': The returned value was not constructed with the HTMLElement constructor.");if(r.namespaceURI!=="http://www.w3.org/1999/xhtml")throw Error("Failed to construct '"+n+"': The constructed element's namespace must be the HTML namespace.");if(r.hasAttributes())throw Error("Failed to construct '"+n+"': The constructed element must not have any attributes.");if(r.firstChild!==null)throw Error("Failed to construct '"+n+"': The constructed element must not have any children.");if(r.parentNode!==null)throw Error("Failed to construct '"+n+"': The constructed element must not have a parent node.");if(r.ownerDocument!==e)throw Error("Failed to construct '"+n+"': The constructed element's owner document is incorrect.");if(r.localName!==n)throw Error("Failed to construct '"+n+"': The constructed element's local name is incorrect.");return r}catch(s){return A(s),e=i===null?O.call(e,n):u.call(e,i,n),Object.setPrototypeOf(e,HTMLUnknownElement.prototype),e.__CE_state=2,e.__CE_definition=void 0,D(t,e),e}return e=i===null?O.call(e,n):u.call(e,i,n),D(t,e),e}function A(t){var e="",n="",i=0,o=0;t instanceof Error?(e=t.message,n=t.sourceURL||t.fileName||"",i=t.line||t.lineNumber||0,o=t.column||t.columnNumber||0):e="Uncaught "+String(t);var r=void 0;ErrorEvent.prototype.initErrorEvent===void 0?r=new ErrorEvent("error",{cancelable:!0,message:e,filename:n,lineno:i,colno:o,error:t}):(r=document.createEvent("ErrorEvent"),r.initErrorEvent("error",!1,!0,e,n,i),r.preventDefault=function(){Object.defineProperty(this,"defaultPrevented",{configurable:!0,get:function(){return!0}})}),r.error===void 0&&Object.defineProperty(r,"error",{configurable:!0,enumerable:!0,get:function(){return t}}),window.dispatchEvent(r),r.defaultPrevented||console.error(t)}function ut(){var t=this;this.g=void 0,this.F=new Promise(function(e){t.l=e})}ut.prototype.resolve=function(t){if(this.g)throw Error("Already resolved.");this.g=t,this.l(t)};function pt(t){var e=document;this.l=void 0,this.h=t,this.g=e,E(this.h,this.g),this.g.readyState==="loading"&&(this.l=new MutationObserver(this.G.bind(this)),this.l.observe(this.g,{childList:!0,subtree:!0}))}function dt(t){t.l&&t.l.disconnect()}pt.prototype.G=function(t){var e=this.g.readyState;for(e!=="interactive"&&e!=="complete"||dt(this),e=0;e<t.length;e++)for(var n=t[e].addedNodes,i=0;i<n.length;i++)E(this.h,n[i])};function h(t){this.s=new Map,this.u=new Map,this.C=new Map,this.A=!1,this.B=new Map,this.o=function(e){return e()},this.i=!1,this.v=[],this.h=t,this.D=t.I?new pt(t):void 0}h.prototype.H=function(t,e){var n=this;if(!(e instanceof Function))throw new TypeError("Custom element constructor getters must be functions.");ht(this,t),this.s.set(t,e),this.v.push(t),this.i||(this.i=!0,this.o(function(){return mt(n)}))},h.prototype.define=function(t,e){var n=this;if(!(e instanceof Function))throw new TypeError("Custom element constructors must be functions.");ht(this,t),ft(this,t,e),this.v.push(t),this.i||(this.i=!0,this.o(function(){return mt(n)}))};function ht(t,e){if(!lt(e))throw new SyntaxError("The element name '"+e+"' is not valid.");if(W(t,e))throw Error("A custom element with name '"+(e+"' has already been defined."));if(t.A)throw Error("A custom element is already being defined.")}function ft(t,e,n){t.A=!0;var i;try{var o=n.prototype;if(!(o instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var r=function(p){var T=o[p];if(T!==void 0&&!(T instanceof Function))throw Error("The '"+p+"' callback must be a function.");return T},s=r("connectedCallback"),a=r("disconnectedCallback"),l=r("adoptedCallback"),c=(i=r("attributeChangedCallback"))&&n.observedAttributes||[]}catch(p){throw p}finally{t.A=!1}return n={localName:e,constructorFunction:n,connectedCallback:s,disconnectedCallback:a,adoptedCallback:l,attributeChangedCallback:i,observedAttributes:c,constructionStack:[]},t.u.set(e,n),t.C.set(n.constructorFunction,n),n}h.prototype.upgrade=function(t){E(this.h,t)};function mt(t){if(t.i!==!1){t.i=!1;for(var e=[],n=t.v,i=new Map,o=0;o<n.length;o++)i.set(n[o],[]);for(E(t.h,document,{upgrade:function(l){if(l.__CE_state===void 0){var c=l.localName,p=i.get(c);p?p.push(l):t.u.has(c)&&e.push(l)}}}),o=0;o<e.length;o++)z(t.h,e[o]);for(o=0;o<n.length;o++){for(var r=n[o],s=i.get(r),a=0;a<s.length;a++)z(t.h,s[a]);(r=t.B.get(r))&&r.resolve(void 0)}n.length=0}}h.prototype.get=function(t){if(t=W(this,t))return t.constructorFunction},h.prototype.whenDefined=function(t){if(!lt(t))return Promise.reject(new SyntaxError("'"+t+"' is not a valid custom element name."));var e=this.B.get(t);if(e)return e.F;e=new ut,this.B.set(t,e);var n=this.u.has(t)||this.s.has(t);return t=this.v.indexOf(t)===-1,n&&t&&e.resolve(void 0),e.F},h.prototype.polyfillWrapFlushCallback=function(t){this.D&&dt(this.D);var e=this.o;this.o=function(n){return t(function(){return e(n)})}};function W(t,e){var n=t.u.get(e);if(n)return n;if(n=t.s.get(e)){t.s.delete(e);try{return ft(t,e,n())}catch(i){A(i)}}}h.prototype.define=h.prototype.define,h.prototype.upgrade=h.prototype.upgrade,h.prototype.get=h.prototype.get,h.prototype.whenDefined=h.prototype.whenDefined,h.prototype.polyfillDefineLazy=h.prototype.H,h.prototype.polyfillWrapFlushCallback=h.prototype.polyfillWrapFlushCallback;function Y(t,e,n){function i(o){return function(r){for(var s=[],a=0;a<arguments.length;++a)s[a]=arguments[a];a=[];for(var l=[],c=0;c<s.length;c++){var p=s[c];if(p instanceof Element&&d(p)&&l.push(p),p instanceof DocumentFragment)for(p=p.firstChild;p;p=p.nextSibling)a.push(p);else a.push(p)}for(o.apply(this,s),s=0;s<l.length;s++)g(t,l[s]);if(d(this))for(s=0;s<a.length;s++)l=a[s],l instanceof Element&&_(t,l)}}n.prepend!==void 0&&(e.prepend=i(n.prepend)),n.append!==void 0&&(e.append=i(n.append))}function St(t){Document.prototype.createElement=function(e){return ct(t,this,e,null)},Document.prototype.importNode=function(e,n){return e=L.call(this,e,!!n),this.__CE_registry?E(t,e):Q(t,e),e},Document.prototype.createElementNS=function(e,n){return ct(t,this,n,e)},Y(t,Document.prototype,{prepend:C,append:$})}function kt(t){function e(i){return function(o){for(var r=[],s=0;s<arguments.length;++s)r[s]=arguments[s];s=[];for(var a=[],l=0;l<r.length;l++){var c=r[l];if(c instanceof Element&&d(c)&&a.push(c),c instanceof DocumentFragment)for(c=c.firstChild;c;c=c.nextSibling)s.push(c);else s.push(c)}for(i.apply(this,r),r=0;r<a.length;r++)g(t,a[r]);if(d(this))for(r=0;r<s.length;r++)a=s[r],a instanceof Element&&_(t,a)}}var n=Element.prototype;et!==void 0&&(n.before=e(et)),nt!==void 0&&(n.after=e(nt)),ot!==void 0&&(n.replaceWith=function(i){for(var o=[],r=0;r<arguments.length;++r)o[r]=arguments[r];r=[];for(var s=[],a=0;a<o.length;a++){var l=o[a];if(l instanceof Element&&d(l)&&s.push(l),l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)r.push(l);else r.push(l)}for(a=d(this),ot.apply(this,o),o=0;o<s.length;o++)g(t,s[o]);if(a)for(g(t,this),o=0;o<r.length;o++)s=r[o],s instanceof Element&&_(t,s)}),rt!==void 0&&(n.remove=function(){var i=d(this);rt.call(this),i&&g(t,this)})}function Dt(t){function e(o,r){Object.defineProperty(o,"innerHTML",{enumerable:r.enumerable,configurable:!0,get:r.get,set:function(s){var a=this,l=void 0;if(d(this)&&(l=[],R(t,this,function(T){T!==a&&l.push(T)})),r.set.call(this,s),l)for(var c=0;c<l.length;c++){var p=l[c];p.__CE_state===1&&t.disconnectedCallback(p)}return this.ownerDocument.__CE_registry?E(t,this):Q(t,this),s}})}function n(o,r){o.insertAdjacentElement=function(s,a){var l=d(a);return s=r.call(this,s,a),l&&g(t,a),d(s)&&_(t,a),s}}function i(o,r){function s(a,l){for(var c=[];a!==l;a=a.nextSibling)c.push(a);for(l=0;l<c.length;l++)E(t,c[l])}o.insertAdjacentHTML=function(a,l){if(a=a.toLowerCase(),a==="beforebegin"){var c=this.previousSibling;r.call(this,a,l),s(c||this.parentNode.firstChild,this)}else if(a==="afterbegin")c=this.firstChild,r.call(this,a,l),s(this.firstChild,c);else if(a==="beforeend")c=this.lastChild,r.call(this,a,l),s(c||this.firstChild,null);else if(a==="afterend")c=this.nextSibling,r.call(this,a,l),s(this.nextSibling,c);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.")}}b&&(Element.prototype.attachShadow=function(o){if(o=b.call(this,o),t.j&&!o.__CE_patched){o.__CE_patched=!0;for(var r=0;r<t.m.length;r++)t.m[r](o)}return this.__CE_shadowRoot=o}),F&&F.get?e(Element.prototype,F):V&&V.get?e(HTMLElement.prototype,V):xt(t,function(o){e(o,{enumerable:!0,configurable:!0,get:function(){return x.call(this,!0).innerHTML},set:function(r){var s=this.localName==="template",a=s?this.content:this,l=u.call(document,this.namespaceURI,this.localName);for(l.innerHTML=r;0<a.childNodes.length;)M.call(a,a.childNodes[0]);for(r=s?l.content:l;0<r.childNodes.length;)N.call(a,r.childNodes[0])}})}),Element.prototype.setAttribute=function(o,r){if(this.__CE_state!==1)return S.call(this,o,r);var s=w.call(this,o);S.call(this,o,r),r=w.call(this,o),t.attributeChangedCallback(this,o,s,r,null)},Element.prototype.setAttributeNS=function(o,r,s){if(this.__CE_state!==1)return j.call(this,o,r,s);var a=f.call(this,o,r);j.call(this,o,r,s),s=f.call(this,o,r),t.attributeChangedCallback(this,r,a,s,o)},Element.prototype.removeAttribute=function(o){if(this.__CE_state!==1)return k.call(this,o);var r=w.call(this,o);k.call(this,o),r!==null&&t.attributeChangedCallback(this,o,r,null,null)},Element.prototype.removeAttributeNS=function(o,r){if(this.__CE_state!==1)return B.call(this,o,r);var s=f.call(this,o,r);B.call(this,o,r);var a=f.call(this,o,r);s!==a&&t.attributeChangedCallback(this,r,s,a,o)},it?n(HTMLElement.prototype,it):G&&n(Element.prototype,G),st?i(HTMLElement.prototype,st):tt&&i(Element.prototype,tt),Y(t,Element.prototype,{prepend:Et,append:bt}),kt(t)}var gt={};function At(t){function e(){var n=this.constructor,i=document.__CE_registry.C.get(n);if(!i)throw Error("Failed to construct a custom element: The constructor was not registered with `customElements`.");var o=i.constructionStack;if(o.length===0)return o=O.call(document,i.localName),Object.setPrototypeOf(o,n.prototype),o.__CE_state=1,o.__CE_definition=i,D(t,o),o;var r=o.length-1,s=o[r];if(s===gt)throw Error("Failed to construct '"+i.localName+"': This element was already constructed.");return o[r]=gt,Object.setPrototypeOf(s,n.prototype),D(t,s),s}e.prototype=Ct.prototype,Object.defineProperty(HTMLElement.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:e}),window.HTMLElement=e}function Tt(t){function e(n,i){Object.defineProperty(n,"textContent",{enumerable:i.enumerable,configurable:!0,get:i.get,set:function(o){if(this.nodeType===Node.TEXT_NODE)i.set.call(this,o);else{var r=void 0;if(this.firstChild){var s=this.childNodes,a=s.length;if(0<a&&d(this)){r=Array(a);for(var l=0;l<a;l++)r[l]=s[l]}}if(i.set.call(this,o),r)for(o=0;o<r.length;o++)g(t,r[o])}}})}Node.prototype.insertBefore=function(n,i){if(n instanceof DocumentFragment){var o=J(n);if(n=P.call(this,n,i),d(this))for(i=0;i<o.length;i++)_(t,o[i]);return n}return o=n instanceof Element&&d(n),i=P.call(this,n,i),o&&g(t,n),d(this)&&_(t,n),i},Node.prototype.appendChild=function(n){if(n instanceof DocumentFragment){var i=J(n);if(n=N.call(this,n),d(this))for(var o=0;o<i.length;o++)_(t,i[o]);return n}return i=n instanceof Element&&d(n),o=N.call(this,n),i&&g(t,n),d(this)&&_(t,n),o},Node.prototype.cloneNode=function(n){return n=x.call(this,!!n),this.ownerDocument.__CE_registry?E(t,n):Q(t,n),n},Node.prototype.removeChild=function(n){var i=n instanceof Element&&d(n),o=M.call(this,n);return i&&g(t,n),o},Node.prototype.replaceChild=function(n,i){if(n instanceof DocumentFragment){var o=J(n);if(n=m.call(this,n,i),d(this))for(g(t,i),i=0;i<o.length;i++)_(t,o[i]);return n}o=n instanceof Element&&d(n);var r=m.call(this,n,i),s=d(this);return s&&g(t,i),o&&g(t,n),s&&_(t,n),r},v&&v.get?e(Node.prototype,v):Lt(t,function(n){e(n,{enumerable:!0,configurable:!0,get:function(){for(var i=[],o=this.firstChild;o;o=o.nextSibling)o.nodeType!==Node.COMMENT_NODE&&i.push(o.textContent);return i.join("")},set:function(i){for(;this.firstChild;)M.call(this,this.firstChild);i!=null&&i!==""&&N.call(this,document.createTextNode(i))}})})}var y=window.customElements;function vt(){var t=new U;At(t),St(t),Y(t,DocumentFragment.prototype,{prepend:H,append:I}),Tt(t),Dt(t),window.CustomElementRegistry=h,t=new h(t),document.__CE_registry=t,Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:t})}y&&!y.forcePolyfill&&typeof y.define=="function"&&typeof y.get=="function"||vt(),window.__CE_installPolyfill=vt}).call(self);var wt=`<form data-multi-step class='form inline'>
    <div class='row-container'>
        <div class='information'>
            <div class='logo'>
                <img src='' />
                <p></p>
            </div>
            <p data-step="1"> How are we doing?</p>
            <p data-step="2">Glad you like it! Can you help us share the \u2764\uFE0F? </p>
            <input name="feedback" data-step='3' placeholder='How can we improve?' />
            <p data-step='4'>Thanks for the feedback!</p>
        </div>
        <div class='action'>
            <div data-step="1">
                <span class='star' data-star-index='1'></span>
                <span class='star' data-star-index='2'></span>
                <span class='star' data-star-index='3'></span>
                <span class='star' data-star-index='4'></span>
                <span class='star' data-star-index='5'></span>
            </div>
            <div data-step="2">
                <button id="rate-on-store" type='button' data-next-step='4'>Rate on webstore</button>
                <button type='button' data-next-step='4'>No thanks</button>
            </div>
            <button id="submit-form" type='button' data-step="3" data-next-step='4'>Submit</button>
        </div>
    </div>
</form>`;var _t=`
/* Start css reset */
/* 1. Use a more-intuitive box-sizing model. */
*,
*::before,
*::after {
  box-sizing: border-box;
}
/* 2. Remove default margin */
* {
  margin: 0;
}
/* 3. Allow percentage-based heights in the application */
html,
body {
  height: 100%;
}
/* Typographic tweaks! 4. Add accessible line-height 5. Improve text rendering */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
/* 6. Improve media defaults */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}
/* 7. Remove built-in form typography styles */
input,
button,
textarea,
select {
  font: inherit;
}
/* 8. Avoid text overflows */
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}
/* End css reset */

.form {
  width: 100%;
  font-family: Verdana, sans-serif;
}
[data-step],
.form[data-current-step="4"] .action {
  display: none;
}
.form[data-current-step="1"] [data-step="1"],
.form[data-current-step="2"] [data-step="2"],
.form[data-current-step="3"] [data-step="3"],
.form[data-current-step="4"] [data-step="4"] {
  display: block;
}
.row-container {
  align-items: center;
  background: #cce;
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem 1rem;
}

.information {
  align-items: center;
  display: grid;
  gap: 0.5rem;
  grid-auto-flow: column;
}
.action {
  align-items: center;
  display: flex;
}
.logo {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}
.logo img {
  width: 20px;
}
.logo p {
  display: none;
}
button {
  background-color: transparent;
  border-radius: 5px;
  margin-right: 0.5rem;
}
.star {
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold
}
.star:before {
  content: "\u2606";
}
.full.star:before {
  content: "\u2605";
  color: gold;
}

.inline .row-container,
.inline .row-container.active {
  display: flex;
  min-height: 50px;
}
.inline .row-container .information {
  display: flex;
  flex-grow: 100;
}
.row-container .information input {
  flex: 1;
}
.inline .row-container[data-step="4"] .information {
  flex-grow: 0;
}

.small .row-container .information {
  display: flex;
}

.medium .row-container .information {
  grid-auto-flow: row;
}
.medium .logo p {
  display: block;
}`;var Z=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return["size","app-name","logo-url","store-link","form-link"]}connectedCallback(){console.log("Custom form element added to page."),this.updateStyle(this)}disconnectedCallback(){console.log("Custom square element removed from page.")}adoptedCallback(){console.log("Custom square element moved to new page.")}updateStyle(u){let L=document.createElement("style");L.textContent=_t;let C=document.createRange();C.selectNode(document.getElementsByTagName("body").item(0));let $=C.createContextualFragment(wt),H=u.shadowRoot;H.append(L,$);let I=u.getAttribute("size")??"inline",x=u.getAttribute("app-name")??chrome.i18n.getMessage("appName"),N=u.getAttribute("logo-url")??chrome.runtime.getURL("assets/logo-128x128.png"),P=u.getAttribute("store-link")??"https://chrome.google.com/webstore/detail/"+chrome.i18n.getMessage("@@extension_id"),M=u.getAttribute("form-link")??"https://formspree.io/f/mayzdndj";console.log(`Attributes: size=${I}, app=${x}, logo=${N}`);let m=H.querySelector("[data-multi-step]");m.classList.remove("inline","small","medium"),m.classList.add(I),m.querySelector("img").src=N,m.querySelector(".logo p").innerHTML=x;let v=m.getAttribute("data-current-step");v||(v=1,m.setAttribute("data-current-step",v));let b=[...m.querySelectorAll(".star")],F=[...m.querySelectorAll("[data-next-step]")];if(b.length>0){let w=()=>b.forEach(f=>f.classList=["star"]),S=f=>{let j=f.target.getAttribute("data-star-index");w(),b.forEach((B,G)=>G<j?B.classList.add("full"):null)},k=f=>{v=f.target.getAttribute("data-star-index")<5?3:2,m.setAttribute("data-current-step",v)};b.forEach(f=>f.addEventListener("mouseover",S)),b.forEach(f=>f.addEventListener("click",k)),m.addEventListener("mouseleave",w)}F.forEach(w=>w.addEventListener("click",S=>{if(v=S.target.getAttribute("data-next-step"),m.setAttribute("data-current-step",v),w.id==="rate-on-store"&&window.open(P),w.id==="submit-form"){let k={feedback:m.querySelector("input").value,appName:x};fetch(M,{method:"POST",body:JSON.stringify(k)}).then(function(f){return console.log("response",f.json())}).then(function(f){console.log("response 2",f.json())})}v==4&&setTimeout(()=>{m.style.display="none"},1300)}))}};customElements.define("feedback-form",Z);var yt={name:"__MSG_appName__",description:"__MSG_appDesc__",short_name:"__MSG_appShortName_","__comment:homepage_url":"This should be the webstore link, __MSG_@@extension_id__ is not allowed",homepage_url:"https://chrome.google.com/webstore/detail/nekacekgelnakbmhepjioandkacfablo",__package_name__:"emoji-keyboard","__comment:version__":"Firefox does not support leading zeros in versions",version:"23.3.24",__sentry_dsn__:"https://b1d81a9e5f1546f79885a473ce33128c@o526305.ingest.sentry.io/6244539",manifest_version:3,default_locale:"en",author:"Justice Ogbonna",permissions:["contextMenus","storage","cookies","tabs"],host_permissions:["*://*/*"],action:{default_icon:{"16":"assets/logo-16x16.png","24":"assets/logo-24x24.png","32":"assets/logo-32x32.png"},default_title:"__MSG_appName__",default_popup:"popup/popup.html"},content_scripts:[{matches:["http://*/*","https://*/*"],all_frames:!0,js:["content-script/content-script.js"],css:["content-script/content-script.css"]}],icons:{"16":"assets/logo-16x16.png","32":"assets/logo-32x32.png","48":"assets/logo-48x48.png","128":"assets/logo-128x128.png"},web_accessible_resources:[{resources:["assets/logo-24x24.png"],matches:["<all_urls>"]}],background:{service_worker:"background-script/background.js",__firefox__persistent:"false"},__firefox__key:"",__firefox__browser_specific_settings:{gecko:{id:"no-reply@justiceo.com"}}};var jt=yt.__package_name__;var q=class{constructor(u){this.tag="";this.debug=(...u)=>this.internalLog(3,...u);this.log=(...u)=>this.internalLog(2,...u);this.warn=(...u)=>this.internalLog(1,...u);this.error=(...u)=>this.internalLog(0,...u);this.tag=jt+"."+(typeof u=="string"?u:u.constructor.name)}internalLog(u,...L){chrome.tabs.query({active:!0,currentWindow:!0},C=>{C.length===1&&chrome.tabs.sendMessage(C[0].id,{action:"log",data:{level:u,tag:this.tag,messages:L}})})}};document.querySelector("#go-to-options").addEventListener("click",()=>{chrome.runtime.openOptionsPage?chrome.runtime.openOptionsPage():window.open(chrome.runtime.getURL("options.html"))});var Rt=new q("popup");Rt.debug("Init success");})();
