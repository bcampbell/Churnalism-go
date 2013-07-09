/*!
	PURE Unobtrusive Rendering Engine for HTML

	Licensed under the MIT licenses.
	More information at: http://www.opensource.org

	Copyright (c) 2013 Michael Cvilic - BeeBole.com

	Thanks to Rog Peppe for the functional JS jump
	revision: 2.81
*/
var $p=function(){var d=arguments,f=d[0],o=false;if(typeof f==="string")o=d[1]||false;else if(f&&!f[0]&&!f.length)f=[f];return $p.core(f,o)},pure=$p;
$p.core=function(d,f,o){function u(a){typeof console!=="undefined"&&console.log(a);throw"pure error: "+a;}function O(){var a=$p.plugins,b=function(){};b.prototype=a;b.prototype.compile=a.compile||P;b.prototype.render=a.render||Q;b.prototype.autoRender=a.autoRender||R;b.prototype.find=a.find||S;b.prototype._compiler=B;b.prototype._error=u;return new b}function G(a){return a.outerHTML||function(b){var g=document.createElement("div");g.appendChild(b.cloneNode(true));return g.innerHTML}(a)}function C(a,
b){return function(g){return a(String(b.call(g.item||g.context,g)))}}function S(a,b){if(typeof a==="string"){b=a;a=false}return(a||document).querySelectorAll(b)}function H(a,b){return function(g){var c=[a[0]],i=a.length,h,k,l,e,m;try{for(m=1;m<i;m++){h=b[m].call(this,g);k=a[m];if(h===""){l=c[c.length-1];if((e=l.search(/[^\s]+=\"?$/))>-1){c[c.length-1]=l.substring(0,e);k=k.substr(1)}}c[c.length]=h;c[c.length]=k}return c.join("")}catch(n){if(console&&console.log)console.log(n.stack||n.message+" ("+
n.type+(n.arguments?", "+n.arguments.join("-"):"")+"). Use Firefox or Chromium/Chrome to get a full stack of the error. ");return""}}}function T(a){var b=a.match(/^(\w+)\s*<-\s*(\S+)?$/);b===null&&u('bad loop spec: "'+a+'"');b[1]==="item"&&u('"item<-..." is a reserved word for the current running iteration.\n\nPlease choose another name for your loop.');if(!b[2]||b[2].toLowerCase()==="context")b[2]=function(g){return g.context};else if(b[2]&&b[2].indexOf("context")===0)b[2]=x(b[2].replace(/^context\.?/,
""));return{name:b[1],sel:b[2]}}function x(a){if(typeof a==="function")return function(e){e=a.call(e.item||e.context||e,e);return!e&&e!==0?"":e};var b=a.match(/^[\da-zA-Z\$_\@][\w\$:\-]*(\.[\w\$:\-]*[^\.])*$/),g=false,c=a,i=[],h=[],k=0,l;if(b===null){if(/\'|\"/.test(c.charAt(0))){if(/\'|\"/.test(c.charAt(c.length-1))){l=c.substring(1,c.length-1);return function(){return l}}}else for(;(b=c.match(/#\{([^{}]+)\}/))!==null;){g=true;i[k++]=c.slice(0,b.index);h[k]=x(b[1]);c=c.slice(b.index+b[0].length,
c.length)}if(!g)return function(){return a};i[k]=c;return H(i,h)}b=a.split(".");return function(e){var m=e.context||e,n=e[b[0]];e=0;var s;if(n&&typeof n.item!=="undefined"){e+=1;if(b[e]==="pos")return n.pos;m=n.item}for(n=b.length;e<n;){if(!m)break;s=m[b[e]];m=typeof s==="function"?m[b[e]].call(m):s;e++}return!m&&m!==0?"":m}}function D(a,b,g){var c,i,h,k,l,e=[],m,n,s,t,r;if(typeof b==="string"){c=b;(l=b.match(I))||u("bad selector syntax: "+b);i=l[1];h=l[2];k=l[3];l=l[4];if(h==="."||!h&&k)e[0]=a;else e=
o.find(a,h);if(!e||e.length===0)return u('The node "'+b+'" was not found in the template:\n'+G(a).replace(/\t/g,"  "))}else{i=b.prepend;k=b.attr;l=b.append;e=[a]}if(i||l)if(i&&l)u("append/prepend cannot take place at the same time");else if(g)u("no append/prepend/replace modifiers allowed for loop target");else l&&g&&u("cannot append with loop (sel: "+c+")");if(k){s=/^style$/i.test(k);r=(t=/^class$/i.test(k))?"className":k;m=function(j,q){j.setAttribute(J+k,q);if(j[r]&&!s)try{j[r]=""}catch(p){}if(j.nodeType===
1){j.removeAttribute(k);t&&j.removeAttribute(r)}};n=s||t?s?function(j){return j.style.cssText}:function(j){return j.className}:function(j){return j.getAttribute(k)};a=function(j){return j.replace(/\"/g,"&quot;")};i=i?function(j,q){m(j,q+n(j))}:l?function(j,q){m(j,n(j)+q)}:function(j,q){m(j,q)}}else{i=g?function(j,q){var p=j.parentNode;if(p){p.insertBefore(document.createTextNode(q),j.nextSibling);p.removeChild(j)}else u("The template root, can't be looped.")}:i?function(j,q){j.insertBefore(document.createTextNode(q),
j.firstChild)}:l?function(j,q){j.appendChild(document.createTextNode(q))}:function(j,q){for(;j.firstChild;)j.removeChild(j.firstChild);j.appendChild(document.createTextNode(q))};a=function(j){return j}}return{attr:k,nodes:e,set:i,sel:c,quotefn:a}}function E(a,b){var g=K+b+":",c;for(c=0;c<a.nodes.length;c++)a.set(a.nodes[c],g)}function L(a,b,g,c,i){return function(h){var k=b(h),l=h[a],e={items:k},m=0,n,s=[],t=function(j,q,p,y){var z=h.pos,v=h.item,U=h.items;h.pos=q.pos=j;h.item=q.item=k[j];h.items=
k;if(typeof y!=="undefined")h.length=y;if(typeof p==="function"&&p.call(h.item,h)===false)m++;else{s.push(g.call(h.item,h));h.pos=z;h.item=v;h.items=U}},r;h[a]=e;if(F(k)){n=k.length||0;typeof c==="function"&&k.sort(function(j,q){return c.call(h,j,q)});for(r=0;r<n;r++)t(r,e,i,n-m)}else{k&&typeof c!=="undefined"&&u("sort is only available on arrays, not objects");for(n in k)k.hasOwnProperty(n)&&t(n,e,i)}if(typeof l!=="undefined")h[a]=l;else delete h[a];return s.join("")}}function M(a,b,g,c){var i=false,
h,k,l,e,m;for(e in g)if(g.hasOwnProperty(e))if(e==="sort")k=g.sort;else if(e==="filter")l=g.filter;else if(i)u("cannot have more than one loop on a target");else{h=e;i=true}h||u("Error in the selector: "+b+"\nA directive action must be a string, a function or a loop(<-)");i=g[h];if(typeof i==="string"||typeof i==="function"){g={};g[h]={root:i};return M(a,b,g,c)}g=T(h);h=x(g.sel);a=D(a,b,true);b=a.nodes;for(w=0;w<b.length;w++){e=b[w];m=B(e,i);c[c.length]=C(a.quotefn,L(g.name,h,m,k,l));a.nodes=[e];
E(a,c.length-1)}return a}function V(a,b){function g(j,q){var p=j.match(I);p={prepend:!!p[1],prop:p[2],attr:p[3]||W[q],append:!!p[4],sel:j};var y,z,v;for(y=h.a.length-1;y>=0;y--){z=h.a[y];v=(v=z.l[0])&&v[p.prop];if(typeof v!=="undefined"){p.prop=z.p+"."+p.prop;if(h.l[p.prop]===true)v=v[0];break}}if(typeof v==="undefined"){v=x(p.prop)(F(b)?b[0]:b);if(v==="")return false}if(F(v)){h.a.push({l:v,p:p.prop});h.l[p.prop]=true;p.t="loop"}else p.t="str";return p}var c=a.getElementsByTagName("*"),i=[],h={a:[],
l:{}},k,l,e,m,n,s,t,r;e=-1;for(m=c.length;e<m;e++){t=e>-1?c[e]:a;if(t.nodeType===1&&t.className!==""){r=t.className.split(" ");n=0;for(s=r.length;n<s;n++){k=r[n];k=g(k,t.tagName);if(k!==false){l=/nodevalue/i.test(k.attr);if(k.sel.indexOf("@")>-1||l){t.className=t.className.replace("@"+k.attr,"");if(l)k.attr=false}i.push({n:t,cspec:k})}}}}return i}function B(a,b,g,c){var i=[],h,k,l,e,m,n,s,t,r,j=[];c=c||g&&V(a,g);if(g)for(;c.length>0;){l=c[0].cspec;e=c[0].n;c.splice(0,1);if(l.t==="str"){e=D(e,l,false);
E(e,i.length);i[i.length]=C(e.quotefn,x(l.prop))}else{n=x(l.sel);e=D(e,l,true);m=e.nodes;h=0;for(k=m.length;h<k;h++){s=m[h];t=B(s,false,g,c);i[i.length]=C(e.quotefn,L(l.sel,n,t));e.nodes=[s];E(e,i.length-1)}}}for(r in b)if(b.hasOwnProperty(r)){g=0;c=b[r];l=r.split(/\s*,\s*/);n=l.length;do if(typeof c==="function"||typeof c==="string"){r=l[g];e=D(a,r,false);E(e,i.length);i[i.length]=C(e.quotefn,x(c))}else M(a,r,c,i);while(++g<n)}a=G(a);a=a.replace(/<([^>]+)\s(value\=""|selected)\s?([^>]*)>/ig,"<$1 $3>");
a=a.split(J).join("");a=a.split(K);for(g=1;g<a.length;g++){b=a[g];j[g]=i[parseInt(b,10)];a[g]=b.substring(b.indexOf(":")+1)}return H(a,j)}function P(a,b,g){var c=B((g||this[0]).cloneNode(true),a,b);return function(i){return c({context:i})}}function Q(a,b){var g=typeof b==="function"&&b,c,i;c=0;for(i=this.length;c<i;c++)this[c]=N(this[c],(g||o.compile(b,false,this[c]))(a,false));return this}function R(a,b){var g=o.compile(b,a,this[0]),c,i;c=0;for(i=this.length;c<i;c++)this[c]=N(this[c],g(a,false));
return this}function N(a,b){var g,c=a.parentNode,i=0,h;if(!c){c=document.createElement("DIV");c.appendChild(a)}switch(a.tagName){case "BODY":c.removeChild(a);c.innerHTML+=b;return c.getElementsByTagName("BODY")[0];case "TBODY":case "THEAD":case "TFOOT":b="<TABLE>"+b+"</TABLE>";i=1;break;case "TR":b="<TABLE><TBODY>"+b+"</TBODY></TABLE>";i=2;break;case "TD":case "TH":b="<TABLE><TBODY><TR>"+b+"</TR></TBODY></TABLE>";i=3;break;case "OPTGROUP":case "OPTION":b="<SELECT>"+b+"</SELECT>";i=1;break}h=document.createElement("SPAN");
h.style.display="none";document.body.appendChild(h);h.innerHTML=b;for(g=h.firstChild;i--;)g=g.firstChild;c.insertBefore(g,a);c.removeChild(a);document.body.removeChild(h);return a=g}var A=[],w,K="_s"+Math.floor(Math.random()*1E6)+"_",J="_a"+Math.floor(Math.random()*1E6)+"_",I=/^(\+)?([^\@\+]+)?\@?([^\+]+)?(\+)?$/,W={IMG:"src",INPUT:"value"},F=Array.isArray?function(a){return Array.isArray(a)}:function(a){return Object.prototype.toString.call(a)==="[object Array]"};o=o||O();switch(typeof d){case "string":A=
o.find(f||document,d);A.length===0&&u('The template "'+d+'" was not found');break;case "undefined":u("The root of the template is undefined, check your selector");break;default:A=d}w=0;for(d=A.length;w<d;w++)o[w]=A[w];o.length=d;return o};$p.plugins={};
$p.libs={dojo:function(){return function(d,f){return dojo.query(f,d)}},domassistant:function(){DOMAssistant.attach({publicMethods:["compile","render","autoRender"],compile:function(d,f){return $p([this]).compile(d,f)},render:function(d,f){return $($p([this]).render(d,f))[0]},autoRender:function(d,f){return $($p([this]).autoRender(d,f))[0]}});return function(d,f){return $(d).cssSelect(f)}},ext:function(){return function(d,f){return Ext.query(f,d)}},jquery:function(){jQuery.fn.extend({directives:function(d){this._pure_d=
d;return this},compile:function(d,f){return $p(this).compile(this._pure_d||d,f)},render:function(d,f){return jQuery($p(this).render(d,this._pure_d||f))},autoRender:function(d,f){return jQuery($p(this).autoRender(d,this._pure_d||f))}});return function(d,f){return jQuery(d).find(f)}},mootools:function(){Element.implement({compile:function(d,f){return $p(this).compile(d,f)},render:function(d,f){return $p([this]).render(d,f)},autoRender:function(d,f){return $p([this]).autoRender(d,f)}});return function(d,
f){return $(d).getElements(f)}},prototype:function(){Element.addMethods({compile:function(d,f,o){return $p([d]).compile(f,o)},render:function(d,f,o){return $p([d]).render(f,o)},autoRender:function(d,f,o){return $p([d]).autoRender(f,o)}});return function(d,f){d=d===document?d.body:d;return typeof d==="string"?$$(d):$(d).select(f)}},sizzle:function(){return function(d,f){return Sizzle(f,d)}},sly:function(){return function(d,f){return Sly(f,d)}},yui:function(){typeof document.querySelector==="undefined"&&
YUI().use("node",function(d){$p.plugins.find=function(f,o){return d.NodeList.getDOMNodes(d.one(f).all(o))}});YUI.add("pure-yui",function(d){d.Node.prototype.directives=function(f){this._pure_d=f;return this};d.Node.prototype.compile=function(f,o){return $p([this._node]).compile(this._pure_d||f,o)};d.Node.prototype.render=function(f,o){return d.one($p([this._node]).render(f,this._pure_d||o))};d.Node.prototype.autoRender=function(f,o){return d.one($p([this._node]).autoRender(f,this._pure_d||o))}},"0.1",
{requires:["node"]});return true}};
(function(){var d,f=typeof dojo!=="undefined"&&"dojo"||typeof DOMAssistant!=="undefined"&&"domassistant"||typeof Ext!=="undefined"&&"ext"||typeof jQuery!=="undefined"&&"jquery"||typeof MooTools!=="undefined"&&"mootools"||typeof Prototype!=="undefined"&&"prototype"||typeof Sizzle!=="undefined"&&"sizzle"||typeof Sly!=="undefined"&&"sly"||typeof YUI!=="undefined"&&"yui";if(f)d=$p.libs[f]();if(typeof document.querySelector==="undefined")if(typeof d==="function")$p.plugins.find=d;else if(!d)throw"you need a JS library with a CSS selector engine";
if(typeof exports!=="undefined")exports.$p=$p})();