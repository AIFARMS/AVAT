(this.webpackJsonpavat=this.webpackJsonpavat||[]).push([[0],{110:function(e){e.exports=JSON.parse('[{"src":"/assets/tensorflow.gif","altText":"Model assisted annotation","description":"Supports integration with pre-trained Tensorflow models to accelerate annotation","slide_time":10000},{"src":"/assets/add_remove.gif","altText":"Quickly add and remove annotations","description":"Add and remove annotations with ease with individual edits or whole frame edits","slide_time":8000},{"src":"/assets/bounding_box.png","altText":"Bounding Box","description":"Rectangle that serves as a point of refrence for training object detection AI models. This annotation can be coupled with behavior data.","slide_time":4000},{"src":"/assets/annotation_count.png","altText":"Keep track of multiple annotations accross frames","description":"Full frame data summary helps keep track of multiple annotations by local and global id.","slide_time":4000},{"src":"/assets/youtube.png","altText":"Video Support","description":"Supports videos from Local Files, Youtube, Vimeo and Dailymotion","slide_time":4000}]')},112:function(e,t,a){e.exports=a(212)},117:function(e,t,a){},118:function(e,t,a){},144:function(e,t){},145:function(e,t){},146:function(e,t){},212:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),l=a(14),o=a.n(l);a(117),a(118),a(119),a(38);var r=a(88);const s=a(48).fabric;s.util.createClass(s.Rect,{type:"boundingbox",initialize:function(e){e||(e={}),this.callSuper("initialize",e),this.set("label",e.label||"")},toObject:function(){return s.util.object.extend(this.callSuper("toObject"),{label:this.get("label")})},_render:function(e){this.callSuper("_render",e),e.font="10px Helvetica",e.fillStyle="#333",e.fillText(this.label,-this.width/2,-this.height/2+20),e.uniScaleTransform=!1}});const c=a(48).fabric;class d{constructor(e,t,a,n,i,l,o){this.top=e,this.left=t,this.id=l,this.behavior=o,this.color=i,this.width=a,this.height=n}rectangle(){return new c.Rect({hasRotatingPoint:!1,height:this.height,width:this.width,fill:this.color,opacity:".4",top:this.top,left:this.left})}id_text(){return new c.Text(this.id.toString(),{fontSize:20,top:this.top,left:this.left,uniScaleTransform:!1})}generate_no_behavior(){var e=new c.Group([this.rectangle(),this.id_text()],{borderColor:"#000000",hasBorders:!0,uniScaleTransform:!0});var t=this.id;return e.local_id=t,e.toJSON()}generate_mouse_no_behavior(e){var t,a,n,i;new c.Text(this.id.toString(),{fontSize:20,top:this.top,left:this.left,uniScaleTransform:!1});e.on("mouse:down",(function(l){a=!0;var o=e.getPointer(l.e);n=o.x,i=o.y;o=e.getPointer(l.e);var r=new c.Rect({left:n,top:i,originX:"left",originY:"top",width:o.x-n,height:o.y-i,angle:0,fill:"rgba(255,0,0,0.5)",transparentCorners:!1,uniScaleTransform:!0});t=r,e.add(t)})),e.on("mouse:move",(function(l){if(a){var o=e.getPointer(l.e);n>o.x&&t.set({left:Math.abs(o.x)}),i>o.y&&t.set({top:Math.abs(o.y)}),t.set({width:Math.abs(n-o.x)}),t.set({height:Math.abs(i-o.y)}),e.renderAll()}})),e.on("mouse:up",(function(t){a=!1,e.off("mouse:down"),e.off("mouse:up")}))}}const m=a(48).fabric;a(147);class u{constructor(e,t,a){this.frame_data=e.annotations,this.annotation_data=e.behavior_data,this.width=t,this.height=a,this.metadata=e.vid_metadata}get_frame_data(){return this.scale_annotations()}get_frame_rate(){try{return this.metadata.frame_rate}catch(e){return 1}}get_annotation_data(){return this.annotation_data}find_highest_localid(){for(var e=[],t=0;t<this.annotation_data.length;t++)for(var a=0;a<this.annotation_data[t].length;a++)e.push(parseInt(this.annotation_data[t][a].id.replace(/\D/g,"")));return Math.max(...e)+1}scale_annotations(){for(var e=[],t=0;t<this.frame_data.length;t++){var a=[],n=this.frame_data[t];if(null!=n){for(var i=0;i<n.length;i++)if("bounding_box"===n[i].type){var l=parseInt(n[i].x)/parseInt(this.metadata.horizontal_res)*this.width,o=n[i].y/this.metadata.vertical_res*this.height,r=n[i].width/this.metadata.horizontal_res*this.width,s=n[i].height/this.metadata.vertical_res*this.height,c="#"+((1<<24)*Math.random()|0).toString(16),u=new d(o,l,r,s,c,n[i].local_id,"None").generate_no_behavior(this);u.local_id=n[i].local_id,a.push(u)}else if("segmentation"===n[i].type){for(var h=[],g=n[i].points,p=0;p<g.length;p++){var f=parseInt(g[p].x)/parseInt(this.metadata.horizontal_res)*this.width,_=g[p].y/this.metadata.vertical_res*this.height;h.push({x:f,y:_})}var b=new m.Polygon(h,{strokeWidth:1,stroke:"green",opacity:.5,scaleX:1,scaleY:1,objectCaching:!1,transparentCorners:!1,cornerColor:"blue",originX:"center",originY:"center"}),v=new m.Text(n[i].local_id,{fontSize:20,centerX:"center",top:h[0].y,left:h[0].x,uniScaleTransform:!1,fill:"white"}),y=new m.Group([b,v],{perPixelTargetFind:!0});y.lockMovementY=!0,y.lockMovementX=!0,y.selectable=!1,y.local_id=n[i].local_id,a.push(y)}e.push(a)}else e.push([])}return e}}var h=a(55);const g=[{value:"Feeding",label:"Feeding"},{value:"Drinking",label:"Drinking"},{value:"Exploratory",label:"Exploratory"},{value:"Social",label:"Social"},{value:"Locomotion",label:"Locomotion"},{value:"Proximity",label:"Proximity"},{value:"Others",label:"Others"}],p=[{value:"Lying",label:"Lying"},{value:"Sitting",label:"Sitting"},{value:"Kneeling",label:"Kneeling"},{value:"Standing",label:"Standing"}],f=[{value:"No occlusion",label:"No occlusion"},{value:"Minor occlusion",label:"Minor occlusion"},{value:"Split occlusion",label:"Split occlusion"},{value:"End occlusion",label:"End occlusion"},{value:"Critical occlusion",label:"Critical occlusion"}];var _=a(12);const b=e=>[{dataField:"id",text:"ID",headerStyle:()=>({width:"40px",left:0}),editable:!1},{dataField:"global_id",text:"Glo",headerStyle:()=>({width:"70px",left:0})},{dataField:"posture",text:"Posture",editor:{type:h.Type.SELECT,options:p}},{dataField:"behavior",text:"Behavior",editor:{type:h.Type.SELECT,options:g}},{dataField:"confidence",text:"Confidence",editor:{type:h.Type.SELECT,options:f}},{dataField:"remove",text:"Del",editable:!1,headerStyle:()=>({width:"50px",left:0}),headerFormatter:()=>i.a.createElement("div",null,"Del",i.a.createElement(_.a,{className:"btn btn-danger btn-xs",onClick:()=>e(),label:"Del"})),formatter:(t,a)=>i.a.createElement("div",null,i.a.createElement(_.a,{className:"btn btn-danger btn-xs",onClick:()=>e(a.id),label:"Del"}))}];var v=a(76),y=a(54),E=a(217),w=a(45),S=a(25),k=a(13),O=a(218),j=a(10);a(157);function x(){return i.a.createElement("div",null,i.a.createElement("h3",null,"Keybinds:"),"There are preset keybinds setup to make it easier to use the tool without having to click around. If done properly a combination of mouse and keyboard actions speed up the annotation process.",i.a.createElement("br",null),i.a.createElement("br",null),"* ",i.a.createElement("kbd",null,"1")," : Mode Switch: Behavior",i.a.createElement("br",null),"* ",i.a.createElement("kbd",null,"2")," : Mode Switch: Bounding Box",i.a.createElement("br",null),"* ",i.a.createElement("kbd",null,"3")," : Mode Switch: Segmentation (Currently Disabled)",i.a.createElement("br",null),"* ",i.a.createElement("kbd",null,"a")," : Add annotation",i.a.createElement("br",null),"* ",i.a.createElement("kbd",null,"e")," : Skip forward frame(s)",i.a.createElement("br",null),"* ",i.a.createElement("kbd",null,"q")," : Skip backward frame(s)",i.a.createElement("br",null),"* ",i.a.createElement("kbd",null,"w")," : Pause/Play",i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("h3",null,"Uploading Video:"),'Ensure that you know the framerate of the video chosen to be annotated. These values should be entered into the settings tab into their "frame rate" fields.',i.a.createElement("br",null),i.a.createElement("br",null),"Click on the right side browse button. All other buttons on the screen shuold be disabled until the video has been uploaded. Currenntly ```.mp4``` format is the best choice and tested for. Other file types such as .avi are supported but might have unintended bugs.",i.a.createElement("br",null),"Please note that videos SHOULD be in 16:9 aspect ratio for best results. Extraneous behavior may occur if resolution is different.",i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("h3",null,"Uploading Image:"),"Select all of the image files needed for the various inputs. To select a group of images, they should be in the same folder.",i.a.createElement("br",null),"Please note that images SHOULD be in 16:9 aspect ratio for best results. Extraneous behavior may occur if resolution is different.",i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("h3",null,"Annotations"),i.a.createElement("br",null),"There are currently two kinds of annotations.",i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("h4",null,"Behavior Annotation:"),"This is for having annotations that do not have any visual attribute attached to it. This annotation is also attached by default when the bounding box or segmentation annotation is created.",i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("h4",null,"Bounding Box:"),"This forms a square around the desired object. There should be small squares at the edges of the bounding box which can be used to resize the box. The number on the top left of the box is used to identify the placement of the box in the table to the right.",i.a.createElement("br",null),i.a.createElement("br",null))}var C=a(16);const T=Object(C.b)({name:"frame_data",initialState:{data:[]},reducers:{init(e,t){for(var a=[],n=0;n<t.payload;n++)a.push([]);e.data=a},initOldAnnotation(e,t){e.data=t.payload},modifyFrame(e,t){var a=e.data;a[t.payload.currentFrame]=t.payload.data,e.data=a},middleware:e=>e({serializableCheck:!1})}}),{init:N,modifyFrame:A}=T.actions;var F=T.reducer;const I=Object(C.b)({name:"annotation_data",initialState:{data:[]},reducers:{init(e,t){console.log(t.payload);for(var a=[],n=0;n<t.payload;n++)a.push([]);e.data=a},initOldAnnotation(e,t){e.data=t.payload},modifyFrame(e,t){var a=e.data;a[t.payload.currentFrame]=t.payload.data,e.data=a},middleware:e=>e({serializableCheck:!1})}}),{init:B,modifyFrame:P}=I.actions;var D=I.reducer;const z={data:void 0},R=Object(C.b)({name:"column_annot",initialState:z,reducers:{init(e,t){console.log(t.payload.data),e.data=t.payload.data},middleware:e=>e({serializableCheck:!1})}}),{init:M}=R.actions;var V=R.reducer;const U={data:void 0},L=Object(C.b)({name:"current_frame",initialState:U,reducers:{init(e,t){console.log(t.payload.data),e.data=t.payload.data},changeFrame(e,t){e.data=t.payload.data},middleware:e=>e({serializableCheck:!1})}}),{init:H}=L.actions;var J=L.reducer;const K=Object(C.b)({name:"media_data",initialState:{data:[]},reducers:{init(e,t){for(var a=[],n=0;n<t.payload;n++)a.push([]);e.data=a},addMedia(e,t){var a=e.data,n=t.payload.media;a[t.payload.stream_num]=n,e.data=a},middleware:e=>e({serializableCheck:!1})}}),{init:Y,modifyFrame:X}=K.actions;var W=K.reducer;function q(e){we.dispatch({type:"frame_data/init",payload:e})}function G(e,t){we.dispatch({type:"frame_data/modifyFrame",payload:{currentFrame:e,data:t}})}function Q(e){return console.log(we.getState()),JSON.parse(JSON.stringify(we.getState().frame_data.data[e]))}function Z(e){we.dispatch({type:"annotation_data/init",payload:e})}function $(e,t){we.dispatch({type:"annotation_data/modifyFrame",payload:{currentFrame:e,data:t}})}function ee(e){return JSON.parse(JSON.stringify(we.getState().annotation_data.data[e]))}function te(){return JSON.parse(JSON.stringify(we.getState().current_frame)).data}function ae(e){we.dispatch({type:"current_frame/changeFrame",payload:{data:e}})}function ne(e){we.dispatch({type:"media_data/init",payload:e})}function ie(e,t){we.dispatch({type:"media_data/addMedia",payload:{stream_num:e,media:t}})}function le(e){we.dispatch({type:"metadata/setFrameRate",payload:{frame_rate:e}})}function oe(e){we.dispatch({type:"metadata/setMediaType",payload:{media_type:e}})}function re(e){we.dispatch({type:"metadata/setTotalFrames",payload:{total_frames:e}})}function se(e){we.dispatch({type:"metadata/setSkipValue",payload:{skip_value:e}})}function ce(){return JSON.parse(JSON.stringify(we.getState().metadata))}const de=Object(C.b)({name:"metadata",initialState:{horizontal_res:0,vertical_res:0,frame_rate:1,media_type:"in_video",total_frames:0,skip_value:1},reducers:{init(e,t){e.horizontal_res=t.payload.horizontal_res,e.vertical_res=t.payload.vertical_res,e.frame_rate=t.payload.frame_rate,e.media_type=t.payload.media_type,e.total_frames=t.payload.total_frames},setRes(e,t){e.horizontal_res=t.payload.horizontal_res,e.vertical_res=t.payload.vertical_res},setFrameRate(e,t){if("in_image"!=e.media_type){var a=JSON.parse(JSON.stringify(e)).frame_rate;e.total_frames=e.total_frames/a,e.total_frames=e.total_frames*t.payload.frame_rate,e.frame_rate=t.payload.frame_rate}},setMediaType(e,t){e.media_type=t.payload.media_type},setTotalFrames(e,t){e.total_frames=t.payload.total_frames},setSkipValue(e,t){e.skip_value=t.payload.skip_value},middleware:e=>e({serializableCheck:!1})}}),{init:me,setRes:ue,setFrameRate:he,setMediaType:ge,setTotalFrames:pe,setSkipValue:fe}=de.actions;var _e=de.reducer;const be=Object(C.b)({name:"play_status",initialState:{play:!1},reducers:{init(e,t){e.play=!1},togglePlay(e,t){e.play=!e.play},middleware:e=>e({serializableCheck:!1})}}),{init:ve,togglePlay:ye}=be.actions;var Ee=be.reducer,we=Object(C.a)({reducer:{frame_data:F,annotation_data:D,column_annot:V,current_frame:J,media_data:W,metadata:_e,play_status:Ee},devTools:!1});class Se{constructor(e,t,a,n,i){console.log(t),console.log(a),this.frame_data=e,this.width=t,this.height=a,this.metadata=n,this.image_data=i}get_frame_json(){var e=new Array(this.frame_data.length);console.log(this.metadata),console.log(this.frame_data);for(var t=0;t<this.frame_data.length;t++){var a=[];if(this.frame_data[t]!=[]){var n=this.frame_data[t];if(void 0!=n){for(var i=0;i<n.length;i++)try{if(console.log(n[i]),void 0==n[i])continue;if("group"!==n[i].type)continue;if("rect"===n[i]._objects[0]){console.log(n[i]);var l=n[i].left/this.width*this.metadata.horizontal_res,o=n[i].top/this.height*this.metadata.vertical_res,r=n[i].width*n[i].scaleX/this.width*this.metadata.horizontal_res,s=n[i].height*n[i].scaleY/this.height*this.metadata.vertical_res,c=n[i]._objects[1].text;"in_image"==this.metadata.media_type?a.push({type:"bounding_box",x:l,y:o,width:r,height:s,local_id:c,"fileName:":this.image_data[t].name,dataType:"image"}):a.push({type:"bounding_box",x:l,y:o,width:r,height:s,local_id:c,"fileName:":this.metadata.name,dataType:"video"})}else if("polygon"===n[i]._objects[0].type){var d=n[i]._objects[0].points,m=[];console.log(this.metadata),console.log(this.metadata.horizontal_res),console.log(this.width),console.log(this.height);for(var u=0;u<d.length;u++){l=d[u].x/this.width*this.metadata.horizontal_res,o=d[u].y/this.height*this.metadata.vertical_res;m.push({x:l,y:o})}c=n[i]._objects[1].text;"in_image"==this.metadata.media_type?a.push({type:"segmentation",points:m,local_id:c,"fileName:":this.image_data[t].name,dataType:"image"}):a.push({type:"segmentation",points:m,local_id:c,"fileName:":this.metadata.name,dataType:"video"})}}catch(h){console.log(h)}e[t]=a}else console.log("Exporting error")}else console.log("Exporting error")}return e}get_frame_json_fullCanvas(){var e=new Array(this.frame_data.length);console.log(this.metadata);for(var t=0;t<this.frame_data.length;t++){var a=[];if(this.frame_data[t]!=[]){var n=this.frame_data[t].objects;if(void 0!=n){for(var i=0;i<n.length;i++)if(console.log(n[i]),"group"===n[i].type)if("rect"===n[i].objects[0].type){console.log(n[i]);var l=n[i].left/this.width*this.metadata.horizontal_res,o=n[i].top/this.height*this.metadata.vertical_res,r=n[i].width*n[i].scaleX/this.width*this.metadata.horizontal_res,s=n[i].height*n[i].scaleY/this.height*this.metadata.vertical_res,c=n[i].objects[1].text;0!=this.image_data.length?a.push({type:"bounding_box",x:l,y:o,width:r,height:s,local_id:c,"fileName:":this.image_data[t].name,dataType:"image"}):a.push({type:"bounding_box",x:l,y:o,width:r,height:s,local_id:c,"fileName:":this.metadata.name,dataType:"video"})}else if("polygon"===n[i].objects[0].type){for(var d=n[i].objects[0].points,m=[],u=0;u<d.length;u++){l=d[u].x/this.width*this.metadata.horizontal_res,o=d[u].y/this.height*this.metadata.vertical_res;m.push({x:l,y:o})}c=n[i].objects[1].text;0!=this.image_data.length?a.push({type:"segmentation",points:m,local_id:c,"fileName:":this.image_data[t].name,dataType:"image"}):a.push({type:"segmentation",points:m,local_id:c,"fileName:":this.metadata.name,dataType:"video"})}e[t]=a}}}return e}get_frame_coco(){}}var ke=a(47),Oe=a(221);var je=a(18);function xe(e){const[t,a]=Object(n.useState)(!1),[l,o]=Object(n.useState)(!0),[r,s]=Object(n.useState)("in_video"),[c,d]=Object(n.useState)(!1),[m,u]=Object(n.useState)(!1),[h,g]=Object(n.useState)(1),[p,f]=Object(n.useState)(!1),b=()=>a(!1),C=()=>{o(!1),d(!0)},T=Object(je.b)(e=>e.play_status.play),N=e=>{ie(parseInt(e.target.id),e.target.files)},A=e=>new Promise((t,a)=>{var n=new FileReader;n.onload=function(e){t(JSON.parse(e.target.result))},n.readAsText(e.target.files[0])});return Object(n.useEffect)(()=>{f(0==T?"Play":"Pause")},[T]),i.a.createElement("div",null,i.a.createElement(j.a,{show:t,onHide:b,size:"lg"},i.a.createElement(j.a.Header,{closeButton:!0},i.a.createElement(j.a.Title,null,"Instructions")),i.a.createElement(j.a.Body,null,i.a.createElement(x,null)),i.a.createElement(j.a.Footer,null,i.a.createElement(_.a,{variant:"secondary",onClick:b},"Close"))),i.a.createElement(j.a,{show:l,onHide:C,size:"lg"},i.a.createElement(j.a.Header,{closeButton:!0},i.a.createElement(j.a.Title,null,"Upload")),i.a.createElement(j.a.Body,null,i.a.createElement("div",{style:{display:"grid"}},i.a.createElement(S.a,null,"Media Format:",i.a.createElement(S.a.Control,{as:"select",id:"inlineFormCustomSelect",onChange:e=>{var t;"in_video"===(t=e.target.value)?(s("in_video"),oe("in_video")):"in_image"===t?(s("in_image"),oe("in_image")):alert("Wrong input detected - please report this bug.")},defaultValue:r},i.a.createElement("option",{value:"in_video"},"Video"),i.a.createElement("option",{value:"in_image"},"Image")),i.a.createElement(E.a.Divider,null)),i.a.createElement("div",null,"Stream Num: ",i.a.createElement("input",{type:"number",defaultValue:1,onClick:t=>{e.toggleKeyCheck(!1)},onBlur:t=>{e.toggleKeyCheck(!0)},onChange:e=>{g(e.target.value),ne(e.target.value)}})),i.a.createElement(E.a.Divider,null),(()=>{for(var e=[],t=0;t<h;t++){let a=i.a.createElement(S.a,{key:t,style:{float:"left",gridColumn:1,gridRow:4}},i.a.createElement(S.a.File,{multiple:!0,id:t+"",key:t,label:"Image Upload "+t,accept:"image/*",custom:!0,type:"file",onChange:e=>{N(e)}})),n=i.a.createElement(S.a,{key:t,style:{float:"left",gridColumn:1,gridRow:4}},i.a.createElement(S.a.File,{id:t+"",key:t,label:"Video Upload "+t,accept:".mp4",custom:!0,type:"file",onChange:e=>{N(e)}}));"in_image"===r?e.push(a):"in_video"===r&&e.push(n)}return i.a.createElement("div",null,e.map((e,t)=>e))})(),i.a.createElement(E.a.Divider,null),i.a.createElement(S.a,null,i.a.createElement(S.a.File,{disabled:e.disable_buttons,accept:".json",id:"file",label:"Column Upload",custom:!0,type:"file",onChange:e=>{A(e).then((function(e){var t;void 0!=e.columns?null!=e?(u(!0),t=e,we.dispatch({type:"column_annot/init",payload:{data:t}})):alert("Error in processing columns. Please check the file and try again."):alert("Error in processing columns. Please check the file and try again.")}))}})),i.a.createElement(S.a,null,i.a.createElement(S.a.File,{disabled:!m,accept:".json",id:"file",label:"Annotation Upload",custom:!0,type:"file",onChange:e.handleOldAnnotation})),i.a.createElement(E.a.Divider,null),"Frame Rate: ",i.a.createElement("input",{type:"number",onClick:t=>{e.toggleKeyCheck(!1)},onBlur:t=>{e.toggleKeyCheck(!0)},onChange:e=>{le(e.target.value)}}),i.a.createElement(E.a.Divider,null),"Skip Value: ",i.a.createElement("input",{type:"number",defaultValue:"1",onChange:e=>{se(e.target.value)}}),i.a.createElement(E.a.Divider,null))),i.a.createElement(j.a.Footer,null,i.a.createElement(_.a,{variant:"success",onClick:C},"Upload"))),i.a.createElement(v.a,{sticky:"top",bg:"dark",variant:"dark",className:"bg-5"},i.a.createElement(v.a.Brand,{href:"#home"},"AVAT"),i.a.createElement(y.a,{className:"mr-auto"},i.a.createElement(E.a,{disabled:e.disable_buttons,title:"Export",id:"basic-nav-dropdown"},i.a.createElement(E.a.Item,{onClick:()=>{var t=new Se(we.getState().frame_data.data,e.video_width,e.video_height,ce(),we.getState().media_data.data[0]).get_frame_json();console.log(t),async function(e,t){const a=JSON.stringify({vid_metadata:t,annotations:e,behavior_data:we.getState().annotation_data.data});var n=new Blob([a],{type:"application/json"}),i=await URL.createObjectURL(n),l=document.createElement("a");l.href=i,l.download="generated_annotations.json",document.body.appendChild(l),l.click(),document.body.removeChild(l)}(t,ce())}},"JSON"),i.a.createElement(E.a.Divider,null)),i.a.createElement(w.a,{onClick:()=>a(!0)},"Instructions"),i.a.createElement(w.a,{onClick:e.handle_link_open},"Report")),i.a.createElement("div",null,i.a.createElement(_.a,{variant:"outline-success",onClick:()=>{o(!0)}},"Upload")," "," ",i.a.createElement(k.a,{as:O.a},i.a.createElement(_.a,{variant:"secondary",disabled:!0},e.display_frame_num)," ",i.a.createElement(k.a.Toggle,{split:!0,variant:"secondary",id:"dropdown-split-basic"}),i.a.createElement(k.a.Menu,null,"Skip Value: ",i.a.createElement("input",{type:"number",defaultValue:"1",onChange:e=>{se(e.target.value)}})))," ",i.a.createElement(_.a,{variant:"primary",disabled:e.disable_buttons,onClick:e.skip_frame_backward},"Prev")," ","in_video"===r&&i.a.createElement(_.a,{variant:"primary",disabled:e.disable_buttons,onClick:e=>{we.dispatch({type:"play_status/togglePlay",payload:{}})}},p)," ",i.a.createElement(_.a,{variant:"primary",disabled:e.disable_buttons,onClick:e.skip_frame_forward},"Next")," ",i.a.createElement(k.a,{as:O.a,drop:"left"},i.a.createElement(_.a,{variant:"success",onClick:e.addToCanvas},"Add"),i.a.createElement(k.a.Toggle,{split:!0,variant:"success",id:"dropdown-split-basic"}),i.a.createElement(k.a.Menu,null,i.a.createElement(k.a.Item,{onClick:t=>{e.change_annotation_type("1")}},"Behavior Annotation"),i.a.createElement(k.a.Item,{onClick:t=>{e.change_annotation_type("2")}},"BoundingBox"),i.a.createElement(k.a.Item,{onClick:t=>{e.change_annotation_type("3")}},"Segmentation"))))))}ne(1);const Ce=a(48).fabric,Te=function(e,t,a,n,i,l,o){if("in_image"==t){var r=new Image;return r.onload=function(){l.clear(),void 0!=e&&Ce.util.enlivenObjects(e,(function(e){e.forEach((function(e,t){l.add(e)})),l.renderAll()}));var t=new Ce.Image(r,{objectCaching:!1,scaleX:n/r.width,scaleY:i/r.height});l.setBackgroundImage(t),l.renderAll()},void(r.src=URL.createObjectURL(a))}l.remove(...l.getObjects()),void 0!=e&&Ce.util.enlivenObjects(e,(function(e){e.forEach((function(e,t){l.add(e)})),l.renderAll()})),l.renderAll()};function Ne(e){const[t,a]=Object(n.useState)(null),[l,r]=Object(n.useState)(0),[s,c]=Object(n.useState)(!1),[d,m]=Object(n.useState)(0),u=Object(je.b)(e=>e.metadata),h=Object(je.b)(e=>e.frame_data),g=Object(je.b)(e=>e.media_data),p=Object(je.b)(e=>e.current_frame),f=p.data,_=Object(je.b)(e=>e.play_status.play),b=g.data[e.stream_num];var v=e=>{console.log(t),t&&G(e,t.getObjects())};if(Object(n.useEffect)(()=>{var t,n=new Ce.Canvas("c",{uniScaleTransform:!0,uniformScaling:!1,includeDefaultValues:!1});Ce.Image.prototype.toObject=(t=Ce.Image.prototype.toObject,function(){return Ce.util.object.extend(t.call(this),{src:this.toDataURL()})}),n.on("mouse:wheel",(function(e){var t=e.e.deltaY,a=n.getZoom();(a*=.999**t)>20&&(a=20),a<.01&&(a=.01),n.zoomToPoint({x:e.e.offsetX,y:e.e.offsetY},a),e.e.preventDefault(),e.e.stopPropagation()})),n.on("object:moving",(function(e){this.objDrag=!0})),n.on("mouse:down",(function(e){var t=e.e;!0===t.altKey&&(this.isDragging=!0,this.selection=!1,this.lastPosX=t.clientX,this.lastPosY=t.clientY)})),n.on("mouse:move",(function(e){if(this.isDragging){var t=e.e,a=this.viewportTransform;a[4]+=t.clientX-this.lastPosX,a[5]+=t.clientY-this.lastPosY,this.requestRenderAll(),this.lastPosX=t.clientX,this.lastPosY=t.clientY}})),n.on("mouse:up",(function(e){this.objDrag&&(console.log("UPDATED DATA BACKGROUND"),v(),this.objDrag=!1),this.setViewportTransform(this.viewportTransform),this.isDragging=!1,this.selection=!0}));o.a.findDOMNode(this);var i=document.getElementsByTagName("canvas")[2*e.stream_num];n.initialize(i,{height:e.scaling_factor_height,width:e.scaling_factor_width,backgroundColor:null}),a(n)},[]),Object(n.useEffect)(()=>{if(t){v(d),m(f);var a=document.getElementsByTagName("video")[e.stream_num];1==s&&(a.currentTime=a.duration*((f+1)/u.total_frames)),"in_video"==u.media_type?Te(Q(f),"in_video",b[0],e.scaling_factor_width,e.scaling_factor_height,t,a,_):"in_image"==u.media_type&&Te(Q(f),"in_image",b[f],e.scaling_factor_width,e.scaling_factor_height,t,_)}},[p]),Object(n.useEffect)(()=>{if(0!=s){var a=document.getElementsByTagName("video")[e.stream_num];if(_)v(d),a.play(),Ce.util.requestAnimFrame((function e(){t.renderAll(),Ce.util.requestAnimFrame(e)}));else{a.pause();let e=Math.ceil(a.currentTime/a.duration*u.total_frames);console.log("FRAME NUMBER",e),ae(e)}}},[_]),Object(n.useEffect)(()=>{t&&Te(Q(f),u.media_type,b[f],e.scaling_factor_width,e.scaling_factor_height,t,_)},[h]),null!=t&&void 0!=b&&!1===s&&!1===_&&b.length>0)if("in_video"==u.media_type){var y=document.getElementsByTagName("video")[e.stream_num],E=document.createElement("source");E.src=URL.createObjectURL(b[0]),E.type="video/mp4",y.appendChild(E),y.onloadedmetadata=function(){Z(parseInt(y.duration)),q(parseInt(y.duration)),re(parseInt(y.duration)),y.currentTime=0},y.oncanplaythrough=function(){if(!1===s){var a=new Ce.Image(y,{objectCaching:!1,scaleX:e.scaling_factor_width/y.videoWidth,scaleY:e.scaling_factor_height/y.videoHeight});y.width=y.videoWidth,y.height=y.videoHeight,t.setBackgroundImage(a),console.log(a),console.log(e.scaling_factor_width/y.videoWidth,e.scaling_factor_height/y.videoHeight),t.renderAll()}c(!0)}}else"in_image"==u.media_type&&Te(Q(f),"in_image",b[f],e.scaling_factor_width,e.scaling_factor_height,t,_);return i.a.createElement("div",{style:{display:"grid"}},i.a.createElement("div",{style:{gridColumn:1,gridRow:1,position:"relative",width:e.scaling_factor_width,height:e.scaling_factor_height,top:0,left:0,opacity:0}},i.a.createElement("video",null)),i.a.createElement("div",{style:{gridColumn:1,gridRow:1,position:"relative",top:0,left:0}},i.a.createElement("canvas",{id:e.stream_num})))}a(162),a(200),a(201);var Ae=a(108),Fe=a(109),Ie=a(72);function Be(e){let{columns:t,data:a,select_data:n,current_frame:l,change_annot:o}=e;const{getTableProps:r,getTableBodyProps:s,headerGroups:c,rows:d,prepareRow:m}=Object(Ie.useTable)({columns:t,data:a});return t?i.a.createElement("table",Object.assign({},r(),{style:{border:"solid 1px blue"}}),i.a.createElement("thead",null,c.map(e=>i.a.createElement("tr",e.getHeaderGroupProps(),e.headers.map(e=>i.a.createElement("th",Object.assign({},e.getHeaderProps(),{style:{background:"#657",color:"white",fontWeight:"bold"}}),e.render("Header")))))),i.a.createElement("tbody",s(),d.map((e,a)=>{m(e);const{id:o,global_id:r,posture:s,behavior:c,confidence:d}=e;return function(e,t,a,n,l){var o=[];console.log(l);for(var r=0;r<a[0].columns.length;r++){var s=a[0].columns[r].accessor;if(!ze(t,s))continue;let c=i.a.createElement("select",{id:n,"data-type":s,"data-curr":l,defaultValue:e[s],onChange:Pe},i.a.createElement("option",{value:""}),t[s].map((e,t)=>i.a.createElement("option",{value:e.value},e.value)));o.push(c)}return i.a.createElement("tr",{key:e.id},i.a.createElement("td",null,e.id),i.a.createElement("td",null,i.a.createElement("input",{type:"text",style:{width:"50%"},defaultValue:e.global_id,id:n,"data-type":"global_id","data-curr":l,onChange:Pe})),o.map((e,t)=>i.a.createElement("td",{id:t},e)),i.a.createElement("td",null,i.a.createElement("input",{type:"button",style:{backgroundColor:"#f44336"},defaultValue:e.global_id,id:n,"data-type":"global_id","data-curr":l,onClick:De})))}(e.original,n,t,a,l)}))):i.a.createElement("div",null,"No column upload detected.")}const Pe=e=>{var t=ee(e.target.dataset.curr);0!==t.length?(t[e.target.id][e.target.dataset.type]=e.target.value,$(parseInt(e.target.dataset.curr),t)):alert("Row changing value failed - please report this bug.")},De=e=>{var t=ee(e.target.dataset.curr);if(0!==t.length){var a=t[e.target.id].id;console.log(a),t.splice(e.target.id,1),$(parseInt(e.target.dataset.curr),t);for(var n=Q(e.target.dataset.curr),i=0;i<n.length;i++)n[i].objects[1].text==a&&n.splice(i,1);G(parseInt(e.target.dataset.curr),n)}else alert("Row deletion failed - please report this bug.")};function ze(e,t){let a=Object.keys(e);for(var n=0;n<a.length;n++)if(a[n]===t)return!0;return!1}function Re(e){var t=e.annotation_data,a=[],n=[],l=void 0;void 0!=we.getState().column_annot.data&&(n=we.getState().column_annot.data.columns,l=we.getState().column_annot.data.select_data,a.push(n));i.a.useMemo(()=>[{Header:"Name",columns:[{Header:"Frame",accessor:"frame_num"},{Header:"Count",accessor:"anno_count"},{Header:"Local ID",accessor:"local_id"},{Header:"Global ID",accessor:"global_ids"}]}],[]);return i.a.createElement("div",null,0!=n.length&&i.a.createElement(Ae.a,{defaultActiveKey:"home",id:"uncontrolled-tab-example"},i.a.createElement(Fe.a,{eventKey:"home",title:"Current"},i.a.createElement(Be,{columns:a,data:t,select_data:l,current_frame:e.currentFrame,change_annot:e.handleChangeAnnot}))))}a(48).fabric;var Me=1920,Ve=1080,Ue=window.screen.height;Ue>=1080?(Me=1280,Ve=720):Ue>=1024?(Me=1152,Ve=648):Ue>=768&&(Me=1024,Ve=576);var Le,He,Je,Ke,Ye,Xe,We=!1,qe=!0,Ge="",Qe={},Ze=!1;function $e(){const[e,t]=Object(n.useState)(0),[a,l]=Object(n.useState)("1"),[o,s]=Object(n.useState)(0),[c,m]=Object(n.useState)(null),[h,g]=Object(n.useState)(!1),[p,f]=Object(n.useState)(!0),[_,v]=Object(n.useState)(!0),[y,E]=Object(n.useState)([]),w=Object(je.b)(e=>e.annotation_data.data),S=Object(je.b)(e=>e.column_annot.data),k=Object(je.b)(e=>e.current_frame).data,O=Object(je.b)(e=>e.media_data.data),j=Object(je.b)(e=>e.metadata);var x=j.media_type,C=parseInt(j.skip_value);Object(n.useEffect)(()=>{if(1==We){var e=ee(k);E(e)}},[k]),Object(n.useEffect)(()=>{1===w.length&&(Z(j.total_frames),q(j.total_frames))},[j]),Object(n.useEffect)(()=>{if(0!=O[0].length)if("in_image"==j.media_type){re(O[0].length),We=!0,qe=!1,Z(O[0].length),q(O[0].length);var e=O[0][0],a=new Image;a.onload=function(){Qe={horizontal_res:a.width,vertical_res:a.height},URL.revokeObjectURL(a.src)},a.src=e,t(10)}else"in_video"==j.media_type&&(We=!0,qe=!1,Z(O[0].length),q(O[0].length),t(10));Me=1920,Ve=1080,Ue>=1080?(Me=1280,Ve=720):Ue>=1024?(Me=1152,Ve=648):Ue>=768&&(Me=1024,Ve=576),Ve*=1/O.length,Me*=1/O.length},[O]);const T=()=>{var e="#"+((1<<24)*Math.random()|0).toString(16);null==y&&E([]);var t="error";if("2"===a){t="b";var n=new d(50,50,50,50,e,o+"b","None").generate_no_behavior(),i=Q(te());(i=Object.assign([],i)).push(n),G(k,i)}else"1"===a&&(t="f");var l,r=ee(te());l=N(o+t),(r=Object.assign([],r)).push(l),$(k,r),s(o+1)};Object(n.useEffect)(()=>{1==We&&E(ee(k))},[w]);const N=e=>{var t=JSON.parse(JSON.stringify(we.getState().column_annot)),a={};t=t.data.columns.columns;for(var n=0;n<t.length;n++){a[t[n].accessor]=""}return"in_image"===x?(a.dataType="image",a.fileName="temp"):(a.dataType="video",a.fileName="frame_"+k),a.id=e,a};Object(n.useEffect)(()=>{null!=c&&(we.dispatch({type:"frame_data/initOldAnnotation",payload:c.get_frame_data()}),we.dispatch({type:"annotation_data/initOldAnnotation",payload:c.get_annotation_data()}),le(c.get_frame_rate()),E(c.get_annotation_data()[0]),s(c.find_highest_localid()))},[c]),Object(n.useEffect)(()=>{v(!1)},[S]);const A=e=>new Promise((t,a)=>{var n=new FileReader;n.onload=function(e){t(JSON.parse(e.target.result))},n.readAsText(e.target.files[0])}),F=e=>{var t=k+C;if(t>=j.total_frames){if("in_image"===x)return void ae(j.total_frames-1);ae(j.total_frames-1)}else{if("in_image"===x)return void ae(t);ae(t)}},I=e=>{var t=k-C;if(t<0){if("in_image"===x)return void ae(0);ae(0)}else{if("in_image"===x)return void ae(t);ae(t)}},B=e=>{if(!1!==p)if(!0!==Ze)if("2"===e.key)Ge="Mode Switch: Bounding Box",g(!0),l("2");else if("4"===e.key)Ge="Mode Switch: Key Point",g(!0),l("4");else if("3"===e.key)Ge="Mode Switch: Segmentation",g(!0),l("3");else if("1"===e.key)Ge="Mode Switch: Behavior Annotation",g(!0),l("1");else if("a"===e.key){var t="";"2"===a?t="Bounding Box":"1"===a?t="Behavior Data":"4"===a?t="Keypoint":"3"===a&&(t="Segmentation"),Ge="Added Annotation - "+t,"3"!==a&&g(!0),T()}else"q"===e.key?I():"e"===e.key?F():e.key;else alert("Please finish your current action!")};Object(n.useEffect)(()=>(document.addEventListener("keydown",B),()=>document.removeEventListener("keydown",B)),[B]);const P=e=>{console.log("Keycheck activated"),f(void 0===e?!p:e)};return i.a.createElement("div",null,i.a.createElement(xe,{disable_buttons:qe,video_width:Me,video_height:Ve,skip_value:C,handleOldAnnotation:e=>{A(e).then((function(e){null!=e?(m(new u(e,Me,Ve)),function(e,t){we.dispatch({type:"metadata/setRes",payload:{horizontal_res:e,vertical_res:t}})}(e.vid_metadata.horizontal_res,e.vid_metadata.vertical_res)):alert("Error in processing Annotation. Please check the file and try again.")}))},currentFrame:k,display_frame_num:"Frame #"+parseInt(k+1)+" / "+parseInt(j.total_frames),skip_frame_forward:F,skip_frame_backward:I,addToCanvas:T,ANNOTATION_VIDEO_NAME:"",change_annotation_type:e=>{l(e)},VIDEO_METADATA:Qe,toggleKeyCheck:P,handle_visual_toggle:()=>{t(Math.floor(999999999999*Math.random()))}}),i.a.createElement(r.a,{onClose:()=>g(!1),show:h,delay:500,autohide:!0,style:{position:"absolute",top:"100",left:"100",zIndex:"100"}},i.a.createElement(r.a.Header,null,i.a.createElement("strong",{className:"mr-auto"},Ge))),!0===We&&i.a.createElement("div",{style:{display:"grid"}},(()=>{for(var e=[],t=0;t<O.length;t++){let a=i.a.createElement("div",{style:{gridColumn:1,gridRow:t+1,position:"relative",top:0,left:0}},i.a.createElement(Ne,{currentFrame:k,scaling_factor_height:Ve,scaling_factor_width:Me,stream_num:t}));e.push(a)}return i.a.createElement("div",null,e.map((e,t)=>e))})(),i.a.createElement("div",{style:{gridColumn:2,gridRow:1,position:"relative",top:0,left:0}},i.a.createElement(Re,{annotation_data:y,change_annotation_data:e=>{E(e)},currentFrame:k,toggleKeyCheck:P,columns:b}))),!1===We&i.a.createElement("div",null,'"Video/Image upload not detected. Please upload."'))}Z(1),q(1),Le=0,we.dispatch({type:"current_frame/init",payload:{data:Le}}),He=Me,Je=Ve,Ke=1,Ye="in_video",Xe=1,we.dispatch({type:"metadata/init",payload:{horizontal_res:He,vertical_res:Je,frame_rate:Ke,media_type:Ye,total_frames:Xe}}),we.dispatch({type:"play_status/init",payload:{}});var et=a(219),tt=a(220),at=a(110);var nt=function(){const[e,t]=Object(n.useState)(!1),a=()=>t(!1),[l,o]=Object(n.useState)(!1),r=e=>{o(!l)},[s,c]=Object(n.useState)(!1);return l?i.a.createElement($e,null):i.a.createElement("div",null,i.a.createElement(j.a,{show:e,onHide:a,size:"lg"},i.a.createElement(j.a.Header,{closeButton:!0},i.a.createElement(j.a.Title,null,"Instructions")),i.a.createElement(j.a.Body,null,i.a.createElement(x,null)),i.a.createElement(j.a.Footer,null,i.a.createElement(_.a,{variant:"secondary",onClick:a},"Close"))),i.a.createElement("main",null,i.a.createElement(et.a,{className:"text-center"},i.a.createElement(tt.a,null,i.a.createElement("h1",{className:"jumbotron-heading"},"AVAT"),i.a.createElement("p",{className:"lead text-muted"}," Analysis tool to record data for livestock behavior and computer vision applications. "),i.a.createElement("p",null,i.a.createElement(_.a,{onClick:r,variant:"success",className:"mx-1 my-2"},"Video Upload")))),i.a.createElement(ke.a,{controls:!1,fade:!0,style:{width:"70%",marginLeft:"auto",marginRight:"auto"}},at.map((e,t)=>i.a.createElement(ke.a.Item,{key:t,interval:e.slide_time},i.a.createElement(Oe.a,{className:"mb-5 box-shadow",top:"true",width:"100%"},i.a.createElement(Oe.a.Img,{width:"60%",variant:"top",src:"."+e.src}),i.a.createElement(Oe.a.Body,{style:{textAlign:"center"}},i.a.createElement(Oe.a.Title,null,e.altText),i.a.createElement(Oe.a.Text,null,e.description))))))))};var it=function(){return i.a.createElement("div",null,i.a.createElement(nt,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(je.a,{store:we},i.a.createElement(it,null),","),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(e=>{e.unregister()}).catch(e=>{console.error(e.message)})}},[[112,1,2]]]);
//# sourceMappingURL=main.792526ab.chunk.js.map