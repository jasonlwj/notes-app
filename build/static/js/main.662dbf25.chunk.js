(this["webpackJsonpsandbox-frontend"]=this["webpackJsonpsandbox-frontend"]||[]).push([[0],{38:function(t,n,e){},39:function(t,n,e){"use strict";e.r(n);var c=e(0),r=e(2),o=e(15),a=e.n(o),u=e(6),i=e(3),s=e(4),j=e.n(s),f="http://localhost:3001/api/notes",l=function(){return j.a.get(f).then((function(t){return t.data}))},b=function(t){return j.a.post(f,t).then((function(t){return t.data}))},d=function(t,n){return j.a.put("".concat(f,"/").concat(t),n).then((function(t){return t.data}))},h=function(t){var n=t.note,e=t.toggleImportance,r=n.important?"make not important":"make important";return Object(c.jsxs)("li",{children:[n.content+" ",Object(c.jsx)("button",{onClick:e,children:r})]})},m=function(t){var n=t.message;return n?Object(c.jsx)("div",{className:"error",children:n}):null},p=function(){var t=Object(r.useState)([]),n=Object(i.a)(t,2),e=n[0],o=n[1],a=Object(r.useState)(""),s=Object(i.a)(a,2),j=s[0],f=s[1],p=Object(r.useState)(!0),O=Object(i.a)(p,2),x=O[0],v=O[1],g=Object(r.useState)(null),S=Object(i.a)(g,2),k=S[0],w=S[1];Object(r.useEffect)((function(){l().then((function(t){return o(t)}))}),[]);var I=x?e:e.filter((function(t){return t.important}));return Object(c.jsx)("div",{className:"App",children:Object(c.jsxs)("div",{children:[Object(c.jsx)("h1",{children:"Notes"}),Object(c.jsx)(m,{message:k}),Object(c.jsxs)("button",{onClick:function(){return v(!x)},children:["show ",x?"important":"all"]}),Object(c.jsx)("ul",{children:I.map((function(t){return Object(c.jsx)(h,{note:t,toggleImportance:function(){return function(t){var n=e.find((function(n){return n.id===t})),c=Object(u.a)(Object(u.a)({},n),{},{important:!n.important});d(t,c).then((function(n){o(e.map((function(e){return e.id===t?n:e})))})).catch((function(c){w("the note '".concat(n.content,"' was already deleted from the server")),setTimeout((function(){return w(null)}),5e3),o(e.filter((function(n){return n.id!==t})))}))}(t.id)}},t.id)}))}),Object(c.jsxs)("form",{onSubmit:function(t){t.preventDefault();var n={content:j,date:(new Date).toISOString(),important:Math.random()<.5};b(n).then((function(t){o(e.concat(t)),f("")}))},children:[Object(c.jsx)("input",{value:j,onChange:function(t){return f(t.target.value)}}),Object(c.jsx)("button",{type:"submit",children:"save"})]})]})})};e(38);a.a.render(Object(c.jsx)(p,{}),document.getElementById("root"))}},[[39,1,2]]]);
//# sourceMappingURL=main.662dbf25.chunk.js.map