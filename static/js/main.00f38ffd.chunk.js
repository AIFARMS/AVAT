(this.webpackJsonpannotation_tool=this.webpackJsonpannotation_tool||[]).push([[0],{104:function(e,t,n){},105:function(e,t,n){},178:function(e,t){},179:function(e,t){},180:function(e,t){},187:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),o=n(13),r=n.n(o),l=(n(104),n(105),n(38)),c=n.n(l),s=(n(45),n(44),n(12),n(42)),u=n.n(s),f=n(56),d=n(7),h=n(11),g=n(37),b=n(36),v=n(22),m=n(28),p=n(23),y=n(24),j=function(){function e(t){Object(p.a)(this,e),this.objects=t.objects,console.log(this.objects)}return Object(y.a)(e,[{key:"getObjects",value:function(){return this.objects}},{key:"getObjectById",value:function(e){return this.objects[e]}},{key:"getObjectByIdFrame",value:function(e,t){return this.objects[e][t]}},{key:"getAllObjectByFrame",value:function(e){var t,n=[];for(t=0;t<this.objects.length;t++){var a=this.objects[t];if(!(a.frames[a.frames.length-1].frameNumber<e))for(var i=a.frames,o=0;o<i.length;o++)if(i[o].frameNumber===e){n.push(i[o]);break}}return console.log(n),n}}]),e}(),w=(n(94),n(71));n(173),w.Type.SELECT,w.Type.SELECT;var O=n(194),E=n(47).fabric,k=function(){function e(t,n,a,i,o,r,l){Object(p.a)(this,e),this.top=t,this.left=n,this.id=r,this.behavior=l,this.color=o,this.width=a,this.height=i}return Object(y.a)(e,[{key:"rectangle",value:function(){return new E.Rect({hasRotatingPoint:!1,uniScaleTransform:!0,height:this.height,width:this.width,fill:this.color,borderColor:"#000",opacity:".4",top:this.top,left:this.left})}},{key:"id_text",value:function(){return new E.Text(this.id.toString(),{fontSize:20,top:this.top,left:this.left,uniScaleTransform:!1})}},{key:"behavior",value:function(){}},{key:"generate_no_behavior",value:function(){return new E.Group([this.rectangle(),this.id_text()],{left:this.left,top:this.top,uniScaleTransform:!0})}},{key:"generate_with_behavior",value:function(){}}]),e}();var S=function(){function e(t,n,a){Object(p.a)(this,e),this.frame_data=t,this.canvas_width=n,this.canvas_height=a,this.windowWidth=3840,this.windowHeight=2178}return Object(y.a)(e,[{key:"generate_frame",value:function(){for(var e=[],t=0;t<this.frame_data.length;t++){var n="#"+((1<<24)*Math.random()|0).toString(16);console.log(this.frame_data[t]);var a=new k(this.getTop(this.frame_data[t]),this.getLeft(this.frame_data[t]),this.getWidth(this.frame_data[t]),this.getHeight(this.frame_data[t]),n,t,"TEST").generate_no_behavior();e.push(a)}return e}},{key:"getID",value:function(e){return e.id}},{key:"getWidth",value:function(e){return Math.floor(e.bbox.width/this.windowWidth*this.canvas_width)}},{key:"getHeight",value:function(e){return Math.floor(e.bbox.height/this.windowHeight*this.canvas_height)}},{key:"getTop",value:function(e){return Math.floor(e.bbox.y/this.windowHeight*this.canvas_height)}},{key:"getLeft",value:function(e){return Math.floor(e.bbox.x/this.windowWidth*this.canvas_width)}}]),e}(),C=n(47).fabric,x=function(){function e(){Object(p.a)(this,e)}return Object(y.a)(e,[{key:"generate_stick",value:function(e){function t(e,t,n,a,i,o){var r=new C.Circle({left:e,top:t,strokeWidth:5,radius:12,fill:"#fff",stroke:"#666"});return r.hasControls=r.hasBorders=!1,r.line1=n,r.line2=a,r.line3=i,r.line4=o,r}function n(e){return new C.Line(e,{fill:"red",stroke:"red",strokeWidth:5,selectable:!1,evented:!1})}C.Object.prototype.originX=C.Object.prototype.originY="center";var a=n([250,125,250,175]),i=n([250,175,250,250]),o=n([250,250,300,350]),r=n([250,250,200,350]),l=n([250,175,175,225]),c=n([250,175,325,225]);e.add(a,i,o,r,l,c),e.add(t(a.get("x1"),a.get("y1"),null,a),t(a.get("x2"),a.get("y2"),a,i,l,c),t(i.get("x2"),i.get("y2"),i,o,r),t(o.get("x2"),o.get("y2"),o),t(r.get("x2"),r.get("y2"),r),t(l.get("x2"),l.get("y2"),l),t(c.get("x2"),c.get("y2"),c)),e.on("object:moving",(function(t){var n=t.target;n.line1&&n.line1.set({x2:n.left,y2:n.top}),n.line2&&n.line2.set({x1:n.left,y1:n.top}),n.line3&&n.line3.set({x1:n.left,y1:n.top}),n.line4&&n.line4.set({x1:n.left,y1:n.top}),e.renderAll()}))}},{key:"generate_poly",value:function(e){}}]),e}(),A=n(47).fabric,D=n(181),_=function(){function e(){Object(p.a)(this,e)}return Object(y.a)(e,[{key:"generate_polygon",value:function(e,t){var n,a=!0,i=new Array,o=new Array,r=!1,l=new function(){e.selection=!1,e.on("mouse:down",(function(e){e.target&&e.target.id===i[0].id&&l.polygon.generatePolygon(i),a&&l.polygon.addPoint(e)})),e.on("mouse:up",(function(e){})),e.on("mouse:move",(function(t){if(n&&"line"==n.class){var a=e.getPointer(t.e);n.set({x2:a.x,y2:a.y});var o=r.get("points");o[i.length]={x:a.x,y:a.y},r.set({points:o}),e.renderAll()}e.renderAll()}))};l.polygon={drawPolygon:function(){a=!0,i=new Array,o=new Array},addPoint:function(t){var a=Math.floor(999901*Math.random())+99,l=(new Date).getTime()+a,c=new A.Circle({radius:5,fill:"#ffffff",stroke:"#333333",strokeWidth:.5,left:t.e.layerX/e.getZoom(),top:t.e.layerY/e.getZoom(),selectable:!1,hasBorders:!1,hasControls:!1,originX:"center",originY:"center",id:l,objectCaching:!1});0==i.length&&c.set({fill:"red"});var s=[t.e.layerX/e.getZoom(),t.e.layerY/e.getZoom(),t.e.layerX/e.getZoom(),t.e.layerY/e.getZoom()],u=new A.Line(s,{strokeWidth:2,fill:"#999999",stroke:"#999999",class:"line",originX:"center",originY:"center",selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});if(r){var f=e.getPointer(t.e);(s=r.get("points")).push({x:f.x,y:f.y});var d=new A.Polygon(s,{stroke:"#333333",strokeWidth:1,fill:"#cccccc",opacity:.3,selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});e.remove(r),e.add(d),r=d,e.renderAll()}else{var h=[{x:t.e.layerX/e.getZoom(),y:t.e.layerY/e.getZoom()}];d=new A.Polygon(h,{stroke:"#333333",strokeWidth:1,fill:"#cccccc",opacity:.3,selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});r=d,e.add(d)}n=u,i.push(c),o.push(u),e.add(u),e.add(c),e.selection=!1},generatePolygon:function(i){var l=new Array;D.each(i,(function(t,n){l.push({x:n.left,y:n.top}),e.remove(n)})),D.each(o,(function(t,n){e.remove(n)})),console.log(i),console.log(o);for(var c=new A.Group,s=0;s<i.length;s++)c.addWithUpdate(i[s]),c.addWithUpdate(o[s]);c.addWithUpdate(new A.Text(t.toString(),{fontSize:20,centerX:"center",top:i[0].top,left:i[0].left,uniScaleTransform:!1})),e.add(c),e.remove(n),e.remove(r),n=null,r=null,a=!1,e.selection=!0}},l.polygon.drawPolygon()}}]),e}(),T=n(47).fabric,R=(n(91),n(92)),M=new T.Canvas("c",{uniScaleTransform:!0}),P=R({displayName:"Fabric",componentDidMount:function(){var e=r.a.findDOMNode(this);M.initialize(e,{height:1080,width:1920,backgroundColor:null}),M.on("mouse:up",(function(){B[N]=M.toJSON()})),M.on("saveData",(function(){M.renderAll()}))},render:function(){return i.a.createElement("canvas",null)}}),B=[],I=!1,N=0;var W=function(){var e=Object(a.useState)(0),t=Object(d.a)(e,2),n=t[0],o=t[1],r=Object(a.useState)(0),l=Object(d.a)(r,2),s=l[0],p=l[1],y=Object(a.useState)(null),w=Object(d.a)(y,2),E=w[0],C=w[1],A=Object(a.useState)(null),D=Object(d.a)(A,2),T=(D[0],D[1],Object(a.useState)(null)),R=Object(d.a)(T,2),W=R[0],F=R[1];Object(a.useEffect)((function(){null!=W&&(console.log(W),console.log(W.getAllObjectByFrame(2)))}),W);var L=function(e){return new Promise((function(t,n){var a=new FileReader;a.onload=function(e){t(JSON.parse(e.target.result))},a.readAsText(e.target.files[0])}))},U=Object(a.useState)(!1),X=Object(d.a)(U,2),Y=X[0],H=X[1],Z="ERROR";Z=!0===Y?"Pause":"Play";var z=Object(a.useState)(!1),J=Object(d.a)(z,2),q=(J[0],J[1]),V=Object(a.useState)(0),G=Object(d.a)(V,2),K=G[0],$=G[1],Q=Object(a.useState)(null),ee=Object(d.a)(Q,2),te=ee[0],ne=ee[1],ae=Object(a.useState)(0),ie=Object(d.a)(ae,2),oe=ie[0],re=ie[1],le=Object(a.useState)(0),ce=Object(d.a)(le,2),se=ce[0],ue=ce[1],fe=Object(a.useState)(0),de=Object(d.a)(fe,2),he=(de[0],de[1],function(){var e=Object(f.a)(u.a.mark((function e(){var t,n,a,i,o;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="generated_annotations",n=JSON.stringify(B),a=new Blob([n],{type:"application/json"}),e.next=5,URL.createObjectURL(a);case 5:i=e.sent,(o=document.createElement("a")).href=i,o.download=t+".json",document.body.appendChild(o),o.click(),document.body.removeChild(o);case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()),ge=Object(a.useState)(!1),be=Object(d.a)(ge,2),ve=be[0],me=be[1],pe=function(){return me(!1)};return i.a.createElement("div",null,i.a.createElement(g.a,{bg:"dark",variant:"dark",className:"bg-5"},i.a.createElement(g.a.Brand,{href:"#home"},"Annotation Tool"),i.a.createElement(b.a,{className:"mr-auto"},i.a.createElement(b.a.Link,{onClick:function(){return me(!0)}},"Instructions"),i.a.createElement(O.a,{title:"Annotation Type",id:"basic-nav-dropdown"},i.a.createElement(O.a.Item,{onClick:function(){o(0)}},"Square Box"),i.a.createElement(O.a.Divider,null),i.a.createElement(O.a.Item,{onClick:function(){o(1)}},"Key Point"),i.a.createElement(O.a.Divider,null),i.a.createElement(O.a.Item,{onClick:function(){o(2)}},"Segmentation")),i.a.createElement(O.a,{title:"Export",id:"basic-nav-dropdown"},i.a.createElement(O.a.Item,{onClick:he},"JSON"),i.a.createElement(O.a.Divider,null),i.a.createElement(O.a.Item,null,"CSV")),i.a.createElement(O.a,{title:"Settings",id:"basic-nav-dropdown"},i.a.createElement(O.a.Divider,null),i.a.createElement(O.a.Item,{disabled:!0},"Input Frame-Rate: ",i.a.createElement("input",{type:"text"})))),i.a.createElement("div",null,i.a.createElement(h.a,{variant:"secondary",disabled:"true"},"Frame # ",parseInt(se)+" / "+parseInt(15*oe)),i.a.createElement(m.a,{style:{float:"left",width:80}},i.a.createElement(m.a.File,{id:"file",label:"Annotation Upload",custom:!0,type:"file",onChange:function(e){L(e).then((function(e){null!=e?F(new j(e)):console.log("ERROR in upload old_annotation")}))}})),i.a.createElement(m.a,{style:{float:"left",width:80}},i.a.createElement(m.a.File,{id:"file",label:"Video Upload",custom:!0,type:"file",onChange:function(e){C(URL.createObjectURL(e.target.files[0])),I=!0}})),i.a.createElement(h.a,{variant:"primary",onClick:function(e){var t=15*oe;te.seekTo((te.getCurrentTime()/oe*t-1)/t)}},"Prev")," ",i.a.createElement(h.a,{variant:"primary",onClick:function(e){H(!Y)}},Z)," ",i.a.createElement(h.a,{variant:"primary",onClick:function(e){var t=15*oe;console.log(se),console.log(B),te.seekTo((te.getCurrentTime()/oe*t+1)/t)}},"Next")," ",i.a.createElement("div",{style:{float:"right"}},i.a.createElement(h.a,{onClick:function(){var e="#"+((1<<24)*Math.random()|0).toString(16);if(0===n){var t=new k(M.height/2,M.width/2,50,50,e,s,"None").generate_no_behavior();M.add(t),M.setActiveObject(t)}else if(1===n)(new x).generate_stick(M);else if(2===n)(new _).generate_polygon(M,s);p(s+1),M.fire("saveData")},style:{position:"relative"}},"Add")," ",i.a.createElement(h.a,{onClick:function(){p(s+1),M.remove(M.getActiveObject()),M.fire("saveData")},style:{position:"relative"}},"Remove")," "))),i.a.createElement(v.a,{show:ve,onHide:pe},i.a.createElement(v.a.Header,{closeButton:!0},i.a.createElement(v.a.Title,null,"Instructions")),i.a.createElement(v.a.Body,null,"TODO: Add instructions"),i.a.createElement(v.a.Footer,null,i.a.createElement(h.a,{variant:"secondary",onClick:pe},"Close"))),i.a.createElement("div",{style:{display:"grid"}},i.a.createElement("div",{style:{gridColumn:1,gridRow:1,position:"relative",width:1920,height:1080,top:0,left:0}},i.a.createElement(c.a,{onProgress:function(e){console.log(e);var t=15*oe;if(t,$(se/t),ue(Math.round(e.played*t)),N=se,null!=W){M.clear();for(var n=new S(W.getAllObjectByFrame(se),1920,1080).generate_frame(),a=0;a<n.length;a++){var i=n[a];console.log(i),M.add(i),M.setActiveObject(i),M.fire("saveData")}}},ref:function(e){if(ne(e),!0===I&&null!=te){console.log("RESET VALUES"),B=new Array(7200);for(var t=0;t<7200;t++)B[t]=[];I=!1}},onDuration:function(e){re(parseInt(e)),console.log(e)},url:E,width:"100%",height:"99.999%",playing:Y,controls:!1,style:{position:"absolute",float:"left",top:0,left:0},volume:0,muted:!0,pip:!1})),i.a.createElement("div",{style:{gridColumn:1,gridRow:1,position:"relative",width:1920,height:1080,top:0,left:0}},i.a.createElement(P,null)),i.a.createElement("div",{style:{gridColumn:1,gridRow:2,position:"relative",width:1920,top:0,left:0}},i.a.createElement("input",{style:{width:1920},type:"range",min:0,max:.999999,step:"any",value:K,onMouseDown:function(e){q(!0)},onChange:function(e){$(parseFloat(e.target.value))},onMouseUp:function(e){q(!1),te.seekTo(parseFloat(e.target.value))}})),i.a.createElement("div",{style:{gridColumn:2,gridRow:1,position:"relative",width:1920,height:1080,top:0,left:0}})))},F=(n(96),n(47).fabric),L=n(91),U=n(92),X=new L.Reactor({debug:!0}),Y=function(e){var t,n={};if(!(e instanceof Object)||Array.isArray(e))throw new Error("keyMirror(...): Argument must be an object.");for(t in e)e.hasOwnProperty(t)&&(n[t]=t);return n}({fabricData:null,activeObject:null}),H=new F.Canvas,Z=L.Store({getInitialState:function(){return L.toImmutable({fabricData:{objects:[]},activeObject:!1})},initialize:function(){this.on(Y.fabricData,this.saveFabricData),this.on(Y.activeObject,this.saveActiveObject)},saveFabricData:function(e,t){return e.set("fabricData",L.toImmutable(t))},saveActiveObject:function(e,t){return e.set("activeObject",t)}});X.registerStores({fabricStore:Z});U({displayName:"Fabric",componentDidMount:function(){var e=r.a.findDOMNode(this);alert("Please use the upload functionality. This is a Alpha version and some features may be missing or broken. The video upload option should have the latest features and bug fixes. This sign will be updated when the youtube option is functional. "),H.initialize(e,{height:.8*window.innerHeight,width:.8*window.innerWidth,backgroundColor:null}),H.on("mouse:up",(function(){X.dispatch(Y.fabricData,H.toObject()),X.dispatch(Y.activeObject,!!H.getActiveObject())})),H.on("saveData",(function(){X.dispatch(Y.fabricData,H.toObject()),X.dispatch(Y.activeObject,!!H.getActiveObject()),H.renderAll()}))},render:function(){return i.a.createElement("canvas",null)}}),U({displayName:"NewObjects",mixins:[X.ReactMixin],getDataBindings:function(){return{fabricData:["fabricStore","fabricData"],activeObject:["fabricStore","activeObject"]}},render:function(){return this.state.fabricData.get("objects").size,i.a.createElement("div",{style:{float:"right"}},i.a.createElement(h.a,{onClick:this.addSquare,style:{position:"relative"}},"Add Square")," ",i.a.createElement(h.a,{onClick:this.remove,style:{position:"relative"}},"Remove")," ")},addSquare:function(){var e="#"+((1<<24)*Math.random()|0).toString(16),t=new F.Rect({hasRotatingPoint:!1,uniScaleTransform:!0,height:50,width:50,originX:"center",originY:"center",fill:e,borderColor:"#000",opacity:".4",top:H.height/2,left:H.width/2},(function(e){console.log(e)}));H.add(t),H.setActiveObject(t),H.fire("saveData")},remove:function(){H.remove(H.getActiveObject()),H.fire("saveData")}}),U({displayName:"ActiveObject",mixins:[X.ReactMixin],getDataBindings:function(){return{fabricObject:["fabricStore","fabricData","objects",0],activeObject:["fabricStore","activeObject"]}},render:function(){if(console.log(this.state.activeObject),this.state.fabricObject){var e=this.state.fabricObject.get("fill");return console.log(H.getActiveObject()),i.a.createElement("div",null,i.a.createElement("div",null,i.a.createElement("b",null,"Active Object")),i.a.createElement("div",null,"fill: ",i.a.createElement("span",{style:{color:e}},this.state.fabricObject.get("fill"))),i.a.createElement("div",null,"top: ",this.state.fabricObject.get("top")),i.a.createElement("div",null,"left: ",this.state.fabricObject.get("left")),i.a.createElement("div",null,"angle: ",this.state.fabricObject.get("angle")),i.a.createElement("div",null,"scaleX: ",this.state.fabricObject.get("scaleX")),i.a.createElement("div",null,"scaleY: ",this.state.fabricObject.get("scaleY")))}return console.log(H.getActiveObject()),null}});n(192),n(193);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(W,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},99:function(e,t,n){e.exports=n(187)}},[[99,1,2]]]);
//# sourceMappingURL=main.00f38ffd.chunk.js.map