import{M as D,bI as Ze,G as r,U as j,bJ as se,bK as Qe,bL as q,g as U,d as L,C as M,h as qe,Q as V,R as et,P as y,S as G,B as A}from"./index-BgZPVzbu.js";A();A();A();A();var de=class Y{constructor(e,i,n,a,o="div"){this.parent=e,this.object=i,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),Y.nextNameID=Y.nextNameID||0,this.$name.id="lil-gui-name-".concat(++Y.nextNameID),this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",s=>s.stopPropagation()),this.domElement.addEventListener("keyup",s=>s.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("disabled",e),this.$disable.toggleAttribute("disabled",e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(e){let i=this.parent.add(this.object,this.property,e);return i.name(this._name),this.destroy(),i}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}};r(de,"Controller");var B=de,ce=class extends B{constructor(e,i,n){super(e,i,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}};r(ce,"BooleanController");var tt=ce;function W(t){let e,i;return(e=t.match(/(#|0x)?([a-f0-9]{6})/i))?i=e[2]:(e=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?i=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(i=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),i?"#"+i:!1}r(W,"normalizeColorString");var nt={isPrimitive:!0,match:r(t=>typeof t=="string","match"),fromHexString:W,toHexString:W},z={isPrimitive:!0,match:r(t=>typeof t=="number","match"),fromHexString:r(t=>parseInt(t.substring(1),16),"fromHexString"),toHexString:r(t=>"#"+t.toString(16).padStart(6,0),"toHexString")},it={isPrimitive:!1,match:r(t=>Array.isArray(t),"match"),fromHexString(t,e,i=1){let n=z.fromHexString(t);e[0]=(n>>16&255)/255*i,e[1]=(n>>8&255)/255*i,e[2]=(n&255)/255*i},toHexString([t,e,i],n=1){n=255/n;let a=t*n<<16^e*n<<8^i*n<<0;return z.toHexString(a)}},at={isPrimitive:!1,match:r(t=>Object(t)===t,"match"),fromHexString(t,e,i=1){let n=z.fromHexString(t);e.r=(n>>16&255)/255*i,e.g=(n>>8&255)/255*i,e.b=(n&255)/255*i},toHexString({r:t,g:e,b:i},n=1){n=255/n;let a=t*n<<16^e*n<<8^i*n<<0;return z.toHexString(a)}},ot=[nt,z,it,at];function he(t){return ot.find(e=>e.match(t))}r(he,"getColorFormat");var ue=class extends B{constructor(e,i,n,a){super(e,i,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=he(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{let o=W(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){let i=this._format.fromHexString(e);this.setValue(i)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}};r(ue,"ColorController");var rt=ue,pe=class extends B{constructor(e,i,n){super(e,i,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}};r(pe,"FunctionController");var J=pe,ge=class extends B{constructor(e,i,n,a,o,s){super(e,i,n,"number"),this._initInput(),this.min(a),this.max(o);let l=s!==void 0;this.step(l?s:this._getImplicitStep(),l),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,i=!0){return this._step=e,this._stepExplicit=i,this}updateDisplay(){let e=this.getValue();if(this._hasSlider){let i=(e-this._min)/(this._max-this._min);i=Math.max(0,Math.min(i,1)),this.$fill.style.width=i*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;let e=r(()=>{let u=parseFloat(this.$input.value);isNaN(u)||(this._stepExplicit&&(u=this._snap(u)),this.setValue(this._clamp(u)))},"onInput"),i=r(u=>{let w=parseFloat(this.$input.value);isNaN(w)||(this._snapClampSetValue(w+u),this.$input.value=this.getValue())},"increment"),n=r(u=>{u.key==="Enter"&&this.$input.blur(),u.code==="ArrowUp"&&(u.preventDefault(),i(this._step*this._arrowKeyMultiplier(u))),u.code==="ArrowDown"&&(u.preventDefault(),i(this._step*this._arrowKeyMultiplier(u)*-1))},"onKeyDown"),a=r(u=>{this._inputFocused&&(u.preventDefault(),i(this._step*this._normalizeMouseWheel(u)))},"onWheel"),o=!1,s,l,d,p,c,f=5,m=r(u=>{s=u.clientX,l=d=u.clientY,o=!0,p=this.getValue(),c=0,window.addEventListener("mousemove",v),window.addEventListener("mouseup",g)},"onMouseDown"),v=r(u=>{if(o){let w=u.clientX-s,_=u.clientY-l;Math.abs(_)>f?(u.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(w)>f&&g()}if(!o){let w=u.clientY-d;c-=w*this._step*this._arrowKeyMultiplier(u),p+c>this._max?c=this._max-p:p+c<this._min&&(c=this._min-p),this._snapClampSetValue(p+c)}d=u.clientY},"onMouseMove"),g=r(()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",v),window.removeEventListener("mouseup",g)},"onMouseUp"),h=r(()=>{this._inputFocused=!0},"onFocus"),b=r(()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()},"onBlur");this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",n),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",m),this.$input.addEventListener("focus",h),this.$input.addEventListener("blur",b)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");let e=r((u,w,_,P,E)=>(u-w)/(_-w)*(E-P)+P,"map"),i=r(u=>{let w=this.$slider.getBoundingClientRect(),_=e(u,w.left,w.right,this._min,this._max);this._snapClampSetValue(_)},"setValueFromX"),n=r(u=>{this._setDraggingStyle(!0),i(u.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",o)},"mouseDown"),a=r(u=>{i(u.clientX)},"mouseMove"),o=r(()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",o)},"mouseUp"),s=!1,l,d,p=r(u=>{u.preventDefault(),this._setDraggingStyle(!0),i(u.touches[0].clientX),s=!1},"beginTouchDrag"),c=r(u=>{u.touches.length>1||(this._hasScrollBar?(l=u.touches[0].clientX,d=u.touches[0].clientY,s=!0):p(u),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",m))},"onTouchStart"),f=r(u=>{if(s){let w=u.touches[0].clientX-l,_=u.touches[0].clientY-d;Math.abs(w)>Math.abs(_)?p(u):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",m))}else u.preventDefault(),i(u.touches[0].clientX)},"onTouchMove"),m=r(()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",m)},"onTouchEnd"),v=this._callOnFinishChange.bind(this),g=400,h,b=r(u=>{if(Math.abs(u.deltaX)<Math.abs(u.deltaY)&&this._hasScrollBar)return;u.preventDefault();let w=this._normalizeMouseWheel(u)*this._step;this._snapClampSetValue(this.getValue()+w),this.$input.value=this.getValue(),clearTimeout(h),h=setTimeout(v,g)},"onWheel");this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",c,{passive:!1}),this.$slider.addEventListener("wheel",b,{passive:!1})}_setDraggingStyle(e,i="horizontal"){this.$slider&&this.$slider.classList.toggle("active",e),document.body.classList.toggle("lil-gui-dragging",e),document.body.classList.toggle("lil-gui-".concat(i),e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:i,deltaY:n}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(i=0,n=-e.wheelDelta/120,n*=this._stepExplicit?1:10),i+-n}_arrowKeyMultiplier(e){let i=this._stepExplicit?1:10;return e.shiftKey?i*=10:e.altKey&&(i/=10),i}_snap(e){let i=Math.round(e/this._step)*this._step;return parseFloat(i.toPrecision(15))}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){let e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}};r(ge,"NumberController");var lt=ge,me=class extends B{constructor(e,i,n,a){super(e,i,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(i=>{let n=document.createElement("option");n.textContent=i,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){let e=this.getValue(),i=this._values.indexOf(e);return this.$select.selectedIndex=i,this.$display.textContent=i===-1?e:this._names[i],this}};r(me,"OptionController");var st=me,fe=class extends B{constructor(e,i,n){super(e,i,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}};r(fe,"StringController");var dt=fe,ct=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function ve(t){let e=document.createElement("style");e.innerHTML=t;let i=document.querySelector("head link[rel=stylesheet], head style");i?document.head.insertBefore(e,i):document.head.appendChild(e)}r(ve,"_injectStyles");var oe=!1,be=class ye{constructor({parent:e,autoPlace:i=e===void 0,container:n,width:a,title:o="Controls",closeFolders:s=!1,injectStyles:l=!0,touchStyles:d=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",p=>{(p.code==="Enter"||p.code==="Space")&&(p.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),d&&this.domElement.classList.add("allow-touch-styles"),!oe&&l&&(ve(ct),oe=!0),n?n.appendChild(this.domElement):i&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=s}add(e,i,n,a,o){if(Object(n)===n)return new st(this,e,i,n);let s=e[i];switch(typeof s){case"number":return new lt(this,e,i,n,a,o);case"boolean":return new tt(this,e,i);case"string":return new dt(this,e,i);case"function":return new J(this,e,i)}console.error(`gui.add failed
	property:`,i,`
	object:`,e,`
	value:`,s)}addColor(e,i,n=1){return new rt(this,e,i,n)}addFolder(e){let i=new ye({parent:this,title:e});return this.root._closeFolders&&i.close(),i}load(e,i=!0){return e.controllers&&this.controllers.forEach(n=>{n instanceof J||n._name in e.controllers&&n.load(e.controllers[n._name])}),i&&e.folders&&this.folders.forEach(n=>{n._title in e.folders&&n.load(e.folders[n._title])}),this}save(e=!0){let i={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof J)){if(n._name in i.controllers)throw new Error('Cannot save GUI with duplicate property "'.concat(n._name,'"'));i.controllers[n._name]=n.save()}}),e&&this.folders.forEach(n=>{if(n._title in i.folders)throw new Error('Cannot save GUI with duplicate folder "'.concat(n._title,'"'));i.folders[n._title]=n.save()}),i}open(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{let i=this.$children.clientHeight;this.$children.style.height=i+"px",this.domElement.classList.add("transition");let n=r(o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))},"onTransitionEnd");this.$children.addEventListener("transitionend",n);let a=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!e),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(i=>{e=e.concat(i.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(i=>{e=e.concat(i.foldersRecursive())}),e}};r(be,"GUI");var ee=be,Ce=ee;A();A();var S=(()=>{let t=new qe;return r(function(e){return t.set(e),"#".concat(t.getHexString())},"normalize")})();function we(t){let e;for(e of t)e()}r(we,"runAll");function Z(t,e){let i=window.location.href,n=new URL(i),a=new URLSearchParams(n.search);for(let o in t)if(t.hasOwnProperty(o)){let s="".concat(e,".").concat(o);a.set(s,t[o])}n.search=a.toString(),history.pushState({path:n.toString()},"",n.toString())}r(Z,"updateCurrentUrlParamsWithNamespace");function Q(t,e){let i=new URLSearchParams(window.location.search),n={};for(let[a,o]of i)if(a.startsWith("".concat(t,"."))){let s=a.slice(t.length+1);o==="true"||o==="false"?n[s]=o==="true":typeof(e==null?void 0:e[s])=="number"?n[s]=Number(o):n[s]=o}return{namespace:t,params:n}}r(Q,"getUrlParamsWithNamespace");var ht=["interactive"];function te(t,e,i){var n,a;let o=i.addFolder("".concat(e.type,"-").concat(e.id));for(let s in e){if(s==="visible"&&o.add(e,s).onChange(l=>{t.updateState(e.id,{[s]:l})}),s==="color"||s==="hoverColor"){e[s]=S(e[s]),o.addColor(e,s).onChange(l=>{t.updateState(e.id,{[s]:l})});continue}if(s==="height"){o.add(e,s,0,20,1).onChange(l=>{t.updateState(e.id,{[s]:l})});continue}if(s==="texture"&&e.texture){(n=o.addFolder("Texture - side").add(e,"texture"))==null||n.onChange(l=>{t.updateState(e.id,{texture:{url:l}})});continue}if(s==="topTexture"&&e.topTexture){(a=o.addFolder("Texture - top").add(e,"topTexture"))==null||a.onChange(l=>{t.updateState(e.id,{topTexture:{url:l}})});continue}if(s==="opacity"){o.add(e,s,0,1,.1).onChange(l=>{t.updateState(e.id,{[s]:l})});continue}ht.includes(s)&&o.add(e,s).onChange(l=>{t.updateState(e.id,{[s]:l})})}return e.isInView&&(o.add(e,"isInView").listen().disable(),o.add(e,"isInViewCheck")),{cleanup(){o.destroy()}}}r(te,"renderByProp");A();A();function xe(){let t=[];function e(a,o){var s;let l=Object.values(a.getMapData())[0],d=o;if(d&&se.is(d)){let p=(s=l.getByType("enterprise-location"))==null?void 0:s.find(c=>c.spaces.some(f=>f.id===d.id));p&&(d=p)}return d}r(e,"getHighlightTarget");async function i(a,o){return o instanceof U?a.Camera.focusOn(o.locations.flatMap(s=>s.spaces),T):o instanceof j?a.Camera.focusOn(o.spaces,T):a.Camera.focusOn(o,T)}r(i,"focusOn");function n(a,o,{focus:s=!1}={}){if(!window.enableHighlightCard)return()=>{};let l=e(a,o),d=document.createElement("div");if(d.style.cssText=`
				position: absolute;
				top: 20px;
				left: 20px;
				background-color: rgba(30, 30, 30, 0.95);
				box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
				border-radius: 12px;
				padding: 24px;
				max-width: 320px;
				z-index: 1000;
				font-family: 'Arial', sans-serif;
				transition: all 0.3s ease;
				color: #e0e0e0;
			`,"name"in l){let c=document.createElement("h3");c.textContent=l.name,c.style.cssText=`
				margin: 0 0 16px;
				font-size: 22px;
				font-weight: 600;
				color: #ffffff;
				letter-spacing: -0.5px;
			`,d.appendChild(c)}if(l instanceof j){if(l.description){let c=document.createElement("p");c.textContent=l.description,c.style.cssText=`
					margin: 0 0 16px;
					font-size: 14px;
					color: #b0b0b0;
					line-height: 1.5;
				`,d.appendChild(c)}if(l.tags&&l.tags.length>0){let c=document.createElement("div");c.style.cssText=`
					display: flex;
					flex-wrap: nowrap;
					gap: 8px;
					margin-bottom: 16px;
					overflow-x: hidden;
					max-height: 30px; /* Adjust this value based on your font size and padding */
				`,l.tags.forEach(f=>{let m=document.createElement("span");m.textContent=f,m.style.cssText=`
						background-color: #3a3a3a;
						color: #e0e0e0;
						padding: 6px 12px;
						border-radius: 16px;
						font-size: 12px;
						font-weight: 500;
						text-transform: uppercase;
						white-space: nowrap;
					`,c.appendChild(m)}),d.appendChild(c)}}let p;if(!(o instanceof U)){let c=new Ce({autoPlace:!1});c.domElement.style.cssText=`
					position: relative;
					overflow-y: auto;
					margin-top: 16px;
					border-top: 1px solid #444;
					padding-top: 16px;
				`;let f=a.getState(o);f&&(te(a,M({id:o.id},f),c),d.appendChild(c.domElement)),p=c}return document.body.appendChild(d),s&&i(a,l),()=>{d.style.opacity="0",d.style.transform="translateY(-10px)",setTimeout(()=>d.remove(),300),p==null||p.destroy()}}return r(n,"highlightCard"),{highlightCard:n,highlight:r((a,o,{focus:s=!0}={})=>{t.length>0&&t.forEach(d=>a.Markers.remove(d));let l=e(a,o);if(l instanceof j)s&&a.Camera.focusOn(l.spaces,T),t.push(...l.spaces.map(d=>a.Markers.add(d,`<div style="padding: 15px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 250px; position: relative;">
							<h3 style="margin: 0 0 10px; color: #333; font-size: 16px; font-weight: 600;">`.concat(l.name,`</h3>
							`).concat(l.description?'<p style="margin: 0 0 10px; color: #666; font-size: 14px; font-weight: 400;">'.concat(l.description,"</p>"):"",`
							`).concat(l.tags?l.tags.map(p=>'<span style="display: inline-block; padding: 3px 8px; background-color: #e0f2f1; color: #00796b; border-radius: 12px; font-size: 12px;">'.concat(p,"</span>")).join(" "):"",`
							<div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid #ffffff;"></div>
						</div>`),{rank:"always-visible",anchor:"top"})));else if(l instanceof U){s&&a.Camera.focusOn(l.locations.flatMap(c=>c.spaces),T);let d=new Map,p=new Set;l.locations.forEach(c=>{d.has(c.name)||(c.spaces.forEach(f=>{t.push(a.Markers.add(f,`<div style="padding: 12px; background-color: rgba(0, 153, 51, 0.95); border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transform: translateY(-4px); transition: all 0.3s ease;">
									<span style="font-weight: 600; color: #FFFFFF; font-size: 16px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">`.concat(c.name,`</span>
								</div>`),{rank:"always-visible"}))}),d.set(c.name,!0))}),l.locations.forEach(c=>{c.coordinates.forEach(f=>{let m="".concat(f.latitude,",").concat(f.longitude);if(!p.has(m)&&!d.has(c.name)){let v=a.Markers.add(f,`<div style="padding: 10px; background-color: rgba(51, 102, 204, 0.9); border-radius: 6px; box-shadow: 0 3px 6px rgba(0,0,0,0.2);">
								<span style="font-weight: 500; color: #FFFFFF; font-size: 16px;">`.concat(c.name,`</span>
								<br>
								<span style="color: #FFFFFF; font-size: 12px; font-weight: 400;">Node</span>
							</div>`),{rank:"always-visible"});p.add(m),t.push(v)}})})}return()=>{t.forEach(d=>a.Markers.remove(d))}},"highlight")}}r(xe,"createHighlightControl");var T={duration:300,easing:"ease-in-out"},X=xe();A();var k={search:"",results:void 0,options:{places:{fields:{name:!0,description:!0,link:!0,category:!0},limit:5},locations:{fields:{name:!0,tag:!0,description:!0},limit:5},categories:{fields:{name:!0},limit:5}}};function Ae(t){t.add(k.options.places.fields,"name").name("Places: Name"),t.add(k.options.places.fields,"description").name("Places: Description"),t.add(k.options.places.fields,"link").name("Places: Link"),t.add(k.options.places.fields,"category").name("Places: Category"),t.add(k.options.places,"limit"),t.add(k.options.locations.fields,"name").name("Locations: Name"),t.add(k.options.locations.fields,"tag").name("Locations: Tag"),t.add(k.options.locations.fields,"description").name("Locations: Description"),t.add(k.options.places,"limit"),t.add(k.options.categories.fields,"name").name("Categories: Name")}r(Ae,"createAdvancedSettings");function ke(t,e,i){var n;let a=new q,o=i.addFolder("Search");o.open();let s=o.add(k,"search").onChange(async f=>{let m=await e.Search.query(f,k.options);m&&(k.results=m,d(m,a))}),l=document.createElement("div");l.style.marginLeft="10px",(n=s.domElement.parentElement)==null||n.appendChild(l);let{renderSearch:d,close:p}=_e(t,e,l,s.$input),c=o.addFolder("Advanced");return c.close(),Ae(c),document.addEventListener("keydown",f=>{(f.metaKey||f.ctrlKey)&&f.key==="k"?(f.preventDefault(),o._closed&&o.open(),s.$input.focus()):f.key==="Escape"&&(p(),a.publish("highlight",void 0))}),{pubsub:a}}r(ke,"createSearchControl");function _e(t,e,i,n){let a,o;n.addEventListener("input",async l=>{l instanceof InputEvent&&(l.inputType==="insertText"||l.inputType==="insertCompositionText")&&(clearTimeout(a),a=setTimeout(async()=>{var d;let p=await e.Search.suggest(n.value);p&&p.length>0&&s((d=p[0])==null?void 0:d.suggestion)},100))});function s(l){if(!l){n.placeholder="";return}let d=n.value;n.value=l,n.setSelectionRange(d.length,l.length)}return r(s,"renderSuggestion"),{renderSearch(l,d){var p,c;if(l.places.length===0&&((p=l.enterpriseCategories)==null?void 0:p.length)===0&&((c=l.enterpriseLocations)==null?void 0:c.length)===0){i.textContent="No results found.";return}o=Ee(i,l,t,d)},close(){o.destroy()}}}r(_e,"mount");function Ee(t,e,i,n){t.innerHTML="";let a=document.createElement("div");Object.assign(a.style,H.dropdownContainer);let o=document.createElement("ul");o.className="options-list",Object.assign(o.style,H.optionsList),o.style.display="block";let s=[],l=r((m,v)=>{if(v&&v.length>0){let g=document.createElement("li");g.textContent=m,Object.assign(g.style,H.sectionHeader),o.appendChild(g),v.forEach((h,b)=>{let u=document.createElement("li");u.textContent="".concat("name"in h.item?h.item.name:""," (").concat(h.type,")"),Object.assign(u.style,H.option),u.tabIndex=0,u.addEventListener("focus",()=>{p(s.indexOf(u))}),u.addEventListener("mouseover",()=>{u.style.backgroundColor="#f0f0f0"}),u.addEventListener("mouseout",()=>{u.style.backgroundColor=""}),u.addEventListener("click",()=>{}),u.setAttribute("data-type",m),u.setAttribute("data-index",b.toString()),o.appendChild(u),s.push(u)})}},"addSection");l("enterpriseLocations",e.enterpriseLocations),l("enterpriseCategories",e.enterpriseCategories),l("Places",e.places),a.appendChild(o),t.appendChild(a);let d=[],p=r(m=>{d.forEach(u=>u()),d=[],s.forEach((u,w)=>{w===m?u.style.backgroundColor="#e0e0e0":u.style.backgroundColor=""});let v=s[m],g=v.getAttribute("data-type"),h=parseInt(v.getAttribute("data-index")||"0",10);if(!g)return;let{item:b}=e[g.toLowerCase()][h];n.publish("highlight",b)},"highlightOption"),c=r(m=>{!a.contains(m.target)&&m.target!==t&&f()},"handleClickOutside");document.addEventListener("click",c);let f=r(()=>{t.innerHTML="",document.removeEventListener("click",c)},"destroy");return{destroy(){t.innerHTML="",n.publish("highlight",void 0)}}}r(Ee,"createCustomDropdown");var H={dropdownContainer:{position:"absolute",color:"#202020"},optionsList:{display:"block",zIndex:"1002",position:"relative",maxHeight:"200px",overflowY:"auto",border:"1px solid #ccc",backgroundColor:"#fff",listStyleType:"none",margin:"0",padding:"0"},sectionHeader:{fontWeight:"bold",padding:"5px",backgroundColor:"#f0f0f0"},option:{padding:"5px",cursor:"pointer"}};function Fe(t,e,i){i.domElement.id="interactionPanel";let n=[],{pubsub:a}=ke(t,e,i);a.on("highlight",c=>{if(c){n.forEach(m=>m()),n=[];let f=c instanceof j?c.spaces[0]:c;if(t.Camera.focusOn(c),f&&!se.is(f))return;n.push(X.highlightCard(t,f,{focus:!0}))}else n.forEach(f=>f()),n=[]});let o=i.addFolder("Click 👇").close(),{sub:s}=Se(t,o);s.on("click",c=>{n.forEach(f=>f()),n=[],c.spaces[0]&&(n=[X.highlightCard(t,c.spaces[0])])});let l=i.addFolder("Hover 🚁").close(),{sub:d}=Me(t,l),p;d.on("hover",c=>{c.spaces[0]?(p==null||p(),n.length===0&&(p=X.highlightCard(t,c.spaces[0]))):(p==null||p(),p=void 0)})}r(Fe,"createInteractionControls");function Se(t,e){let i=new q,n={position:"",hoverColor:S(t.getHoverColor())},a=e.add(n,"position").disable(),o=[];function s(){o.forEach(d=>d()),o.length=0}r(s,"reset");let l=0;return t.on("click",d=>{var p;let{labels:c,markers:f,coordinate:m}=d;s(),i.publish("click",d),clearInterval(l),a.load(JSON.stringify([m.longitude,m.latitude]));let v=c[0]||f[0];if(v){let h=ie(t,v,e);if(!h)return;o.push(h.destroy),h.labelItemFolder.openAnimated()}let g=(p=d.spaces[0])!=null?p:d.objects[0];if(g){let h=L(M({id:g.id},t.getState(g.id)),{type:g.type,isInView:!1,isInViewCheck:ne(t,g.id)}),{cleanup:b}=te(t,h,e);l=setInterval(()=>{h.isInView=t.isInView(v||g)},500),o.push(b)}}),{sub:i}}r(Se,"createClickControls");function Me(t,e){let i=new q;t.setHoverColor("#1f3a7a");let n={position:"",hoverColor:S(t.getHoverColor()),intersected:"",type:"",id:""},a=e.add(n,"position").disable();e.add(n,"id").disable().listen(),e.add(n,"type").disable().listen(),e.addColor(n,"hoverColor").onChange(l=>{t.setHoverColor(l)});let o=[];function s(){o.forEach(l=>l()),o.length=0}return r(s,"reset"),t.on("hover",l=>{var d,p,c;let{coordinate:f,spaces:m,objects:v,markers:g,labels:h}=l;s(),i.publish("hover",l),a.load(JSON.stringify([f.longitude,f.latitude]));let b=(c=(p=(d=m[0])!=null?d:v[0])!=null?p:g[0])!=null?c:h[0];if(!b)return;let u=t.getState(b);u&&(n.type=u.type,n.id=b.id)}),{sub:i}}r(Me,"createHoverControls");function ne(t,e){return r(function(){console.log("isInView",t.isInView(e))},"isInView")}r(ne,"createIsInViewHandler");function $e(t,e,i){let n={labels:{},all(){i.Labels.all().forEach(m=>{this.labels[m.id]=m}),d()},removeAllLabels(){i.Labels.removeAll().forEach(m=>{delete this.labels[m.id]}),d()}},{addLabel:a,destroy:o}=Le(t,i);t.add(n,"all"),t.add(n,"removeAllLabels");let s=t.addFolder("Label List");t.close();let l=new Map,{rerender:d}=p();function p(){function m(h){var b;delete n.labels[h.id],(b=l.get(h.id))==null||b.destroy()}r(m,"remove");function v(h){let b=ie(i,h,s,{onRemove:r(w=>{m(w)},"onRemove")});if(!b)return;let{labelItemFolder:u}=b;l.set(h.id,u)}r(v,"add");function g(){s.destroy(),s=t.addFolder("Label");for(let h in n.labels){let b=n.labels[h];v(b)}}return r(g,"rerender"),{rerender:g,add:v,remove:m}}r(p,"createLabelControls"),t.domElement.classList.add("list-items");let c;i.on("click",({labels:m,coordinate:v})=>{if(!t._closed)if(m[0]){c==null||c.close();let g=l.get(m[0].id);if(t.open(),!g)return;g==null||g.open(),g==null||g.domElement.scrollIntoView({block:"start"}),g==null||g.domElement.focus(),c=g}else a(v)});function f(m){for(let v of m)n.labels[v.id]=v;d()}return r(f,"populatelabels"),{populatelabels:f,destroy(){o()}}}r($e,"createLabelControls");function ie(t,e,i,{onRemove:n}={}){var a,o,s,l;let d=i.addFolder("".concat((a=e.text)==null?void 0:a.substring(0,12)));d.onChange(v=>{t.updateState(e,{appearance:m.appearance,interactive:m.interactive})}),d.close();let p=t.getState(e);if((p==null?void 0:p.type)!=="label")throw new Error("error getting state for label: ".concat(e.id));let{appearance:c,interactive:f}=p;if(!c||c.margin==null||f==null)throw new Error("incomplte label state");let m={text:e.text,interactive:f,appearance:L(M({},c),{margin:c.margin||0,marker:{foregroundColor:(s=(o=c.marker)==null?void 0:o.foregroundColor)!=null&&s.active?S((l=c.marker.foregroundColor)==null?void 0:l.active):"black"},text:{foregroundColor:S(c.text.foregroundColor)}}),remove(){t.Labels.remove(e),n==null||n(e),d.destroy()},isInView:ne(t,e.id)};return d.add(m.appearance,"margin",0,20).name("margin"),d.add(m,"text"),d.add(m,"interactive"),d.addColor(m.appearance.marker,"foregroundColor").name("marker foreground"),d.addColor(m.appearance.text,"foregroundColor").name("text forground"),d.add(m,"isInView"),d.add(m,"remove"),{labelItemFolder:d,destroy(){d.destroy()}}}r(ie,"addLabelControlToFolder");function Le(t,e){let i=t.addFolder("Add"),n={onClick:!1,margin:0,text:"New Label!",interactive:!0,marginForegroundColor:S("skyblue"),marginBackgroundColor:S("coral"),textForegroundColor:S("slategray"),textBackgroundColor:S("white")};return i.add(n,"onClick"),i.add(n,"margin"),i.add(n,"interactive"),i.add(n,"text"),i.addColor(n,"marginForegroundColor"),i.addColor(n,"marginBackgroundColor"),i.addColor(n,"textForegroundColor"),i.addColor(n,"textBackgroundColor"),{destroy(){i.destroy()},addLabel(a){return i._closed||!n.onClick?void 0:e.Labels.add(a,n.text,{appearance:{margin:n.margin,marker:{foregroundColor:{active:n.marginForegroundColor,inactive:n.marginForegroundColor},backgroundColor:{active:n.marginBackgroundColor,inactive:n.marginBackgroundColor}},text:{foregroundColor:n.textForegroundColor,backgroundColor:n.marginBackgroundColor}},interactive:n.interactive})}}}r(Le,"createAddControl");var ut={};A();var re="camera-ui";function Oe(t,e,i){var n,a;let o=t.addFolder("Camera 📷").onOpenClose(C=>{Z({opened:!C._closed},re)}),{params:s}=Q(re);s.opened||o.close();let l=e.Camera.center.toJSON(),d=document.createElement("div");Object.assign(d.style,{display:"none",position:"absolute",left:"0px",zIndex:999,top:"0px",bottom:"0px",right:"0px",backgroundColor:"aqua",pointerEvents:"none",opacity:.5}),e.__core.container.appendChild(d);let{innerHeight:p,innerWidth:c}=window,[f,m,v,g]=(n=i==null?void 0:i.padding)!=null?n:[e.Camera.screenOffsets.top,e.Camera.screenOffsets.right,e.Camera.screenOffsets.bottom,e.Camera.screenOffsets.left],h={center_lat:l.latitude,center_lon:l.longitude,zoomLevel:e.Camera.zoomLevel,pitch:e.Camera.pitch,bearing:e.Camera.bearing,minZoomLevel:e.Camera.minZoomLevel,maxZoomLevel:e.Camera.maxZoomLevel,inset_type:i!=null&&i.padding?"pixel":e.Camera.screenOffsets.type,inset_top:f??0,inset_left:g??0,inset_right:m??0,inset_bottom:v??0,animateOnLoad:!0,persist:r(()=>{Z(o.save().controllers,"camera"),navigator.clipboard.writeText(window.location.href)},"persist"),visualizeInset:!!(f||m||v||g),"Focus on click":(a=i==null?void 0:i.focusOnClick)!=null?a:!0,"Focus on current floor":r(()=>{e.Camera.focusOn([e.currentFloor],{screenOffsets:{top:20,left:20,right:20,bottom:20}})},"Focus on current floor")};function b(){h.inset_type=e.Camera.screenOffsets.type,h.inset_left=e.Camera.screenOffsets.left,h.inset_top=e.Camera.screenOffsets.top,h.inset_right=e.Camera.screenOffsets.right,h.inset_bottom=e.Camera.screenOffsets.bottom,h.inset_type==="portion"?Object.assign(d.style,{left:h.inset_left*c+"px",top:h.inset_top*p+"px",bottom:h.inset_bottom*p+"px",right:h.inset_right*c+"px"}):Object.assign(d.style,{left:h.inset_left+"px",top:h.inset_top+"px",bottom:h.inset_bottom+"px",right:h.inset_right+"px"})}r(b,"updateInsetVisualizer"),o.add(h,"center_lat").listen().disable(),o.add(h,"center_lon").listen().disable(),o.add(h,"zoomLevel",16,22,.5).listen().disable(),o.add(h,"pitch").listen().disable(),o.add(h,"bearing").listen().disable(),o.add(h,"minZoomLevel",5,22,.5).onChange(C=>{e.Camera.setMinZoomLevel(C)}),o.add(h,"maxZoomLevel",10,22,.5).onChange(C=>{e.Camera.setMaxZoomLevel(C)}),o.add(h,"animateOnLoad"),o.add(h,"visualizeInset").onChange(R),R(h.visualizeInset),o.add(h,"inset_type",["pixel","portion"]).onChange(E),o.add(h,"inset_top",0,p).onChange(E),o.add(h,"inset_bottom",0,p).onChange(E),o.add(h,"inset_left",0,c).onChange(E),o.add(h,"inset_right",0,c).onChange(E);let u=De(e);o.add(h,"Focus on click").onChange(C=>{C?e.on("click",u):e.off("click",u)}),h["Focus on click"]&&e.on("click",u),o.add(h,"persist"),o.add(h,"Focus on current floor");let w=r(C=>{o._closed||(h.center_lat=C.center.latitude,h.center_lon=C.center.longitude,h.zoomLevel=C.zoomLevel,h.bearing=C.bearing,h.pitch=C.pitch)},"onCameraChanged");e.on("camera-change",w);let{params:_}=Q("camera",h);if(Object.keys(_).length>0){let C=_;e.Camera.setScreenOffsets({top:C.inset_top,left:C.inset_left,right:C.inset_right,bottom:C.inset_bottom,type:C.inset_type});let ae={pitch:C.pitch,center:new Qe(C.center_lat,C.center_lon),bearing:C.bearing,zoomLevel:C.zoomLevel};C.animateOnLoad?e.Camera.animateTo(ae):e.Camera.set(ae),o.load({controllers:C,folders:{}}),b()}let P=[()=>{e.off("camera-change",w)}];function E(){e.Camera.setScreenOffsets({top:h.inset_top,left:h.inset_left,right:h.inset_right,bottom:h.inset_bottom,type:h.inset_type}),b()}r(E,"updateInset"),(h.inset_top||h.inset_right||h.inset_bottom||h.inset_left)&&E();function R(C){b(),C?d.style.display="block":d.style.display="none"}return r(R,"visualizeInsetUpdated"),()=>({destroy(){o.destroy(),we(P)}})}r(Oe,"createCameraControls");function De(t){return r(function(e){var i;let{spaces:n,objects:a}=e,o=(i=n[0])!=null?i:a[0];o&&t.Camera.focusOn(o)},"handler")}r(De,"createHandler");A();function Ve(t,e,i){let n={markers:{},removeAllMarkers(){i.Markers.removeAll().forEach(m=>{delete this.markers[m.id]}),d()}},{addMarker:a,destroy:o}=Be(t,i);t.add(n,"removeAllMarkers");let s=t.addFolder("Marker List");t.close();let l=new Map,{rerender:d}=p();function p(){function m(h){var b;delete n.markers[h.id],(b=l.get(h.id))==null||b.destroy()}r(m,"remove");function v(h){let b=Ie(i,h,s,{onRemove:r(w=>{m(w)},"onRemove")});if(!b)return;let{markerItemFolder:u}=b;l.set(h.id,u)}r(v,"add");function g(){s.destroy(),s=t.addFolder("marker");for(let h in n.markers){let b=n.markers[h];v(b)}}return r(g,"rerender"),{rerender:g,add:v,remove:m}}r(p,"createMarkerControls"),t.domElement.classList.add("list-items");let c;i.on("click",({markers:m,coordinate:v})=>{if(!t._closed)if(m[0]){c==null||c.close();let g=l.get(m[0].id);if(t.open(),!g)return;g==null||g.open(),g==null||g.domElement.scrollIntoView({block:"start"}),g==null||g.domElement.focus(),c=g}else a(v)});function f(m){for(let v of m)n.markers[v.id]=v;d()}return r(f,"populateMarkers"),{populateMarkers:f,destroy(){o()}}}r(Ve,"createMarkerControls");function Ie(t,e,i,{onRemove:n}={}){let a=i.addFolder("".concat(e.id.toString().substring(0,8)));a.onChange(d=>{t.updateState(e,{interactive:l.interactive})}),a.close();let o=t.getState(e);if((o==null?void 0:o.type)!=="marker")throw new Error("error getting state for marker: ".concat(e.id));let{interactive:s}=o;if(s==null)throw new Error("incomplte label state");let l={interactive:s,remove(){t.Markers.remove(e),n==null||n(e),a.destroy()}};return a.add(l,"interactive"),a.add(l,"remove"),{markerItemFolder:a,destroy(){a.destroy()}}}r(Ie,"addMarkerControlToFolder");function Be(t,e){let i=t.addFolder("Add"),n={onClick:!1,interactive:!0};return i.add(n,"onClick"),i.add(n,"interactive"),{destroy(){i.destroy()},addMarker(a){return i._closed||!n.onClick?void 0:e.Markers.add(a,"<div>New Marker</div>",{interactive:n.interactive})}}}r(Be,"createAddControl");A();function Te(t,e){let i=t.addFolder("Walls").close(),n={visible:!0,topColor:"#b1fa87",color:"#e8e8e8",texture:{url:""},topTexture:{url:""}};i.add(n,"visible").onChange(a=>{e.updateState("walls",{visible:a})}),i.addColor(n,"topColor").onChange(a=>{e.updateState("walls",{topColor:a})}),i.addColor(n,"color").onChange(a=>{e.updateState("walls",{color:a})}),i.addFolder("Texture - side").add(n.texture,"url").onFinishChange(a=>{e.updateState("walls",{texture:{url:a}})}),i.addFolder("Texture - top").add(n.topTexture,"url").onFinishChange(a=>{e.updateState("walls",{topTexture:{url:a}})}),e.updateState("walls",{topColor:n.topColor}),e.updateState("walls",{color:n.color})}r(Te,"createGeometryControl");A();function ze(t,e,i){var n,a;t.close();let o={language:(a=(n=i.currentLanguage)==null?void 0:n.code)!=null?a:"en"},s=i.getByType("enterprise-venue");t.add(o,"language",s==null?void 0:s.languages.map(l=>l.code)).onChange(l=>{i.changeLanguage(l)})}r(ze,"createMiscControl");A();function Pe(t,e,i){let n=t.addFolder("Debug");n.close();let a=e.Debug.state,o={showPolygonLabelTextAreaMesh:a.showPolygonLabelTextAreaMesh,showCollisionBoxes:a.showCollisionBoxes,showEnvMap:a.showEnvMap};n.add(o,"showPolygonLabelTextAreaMesh").onChange(s=>{e.Debug.update({showPolygonLabelTextAreaMesh:s})}).name("Show Flat Label Text Area Mesh"),n.add(o,"showCollisionBoxes").onChange(s=>{e.Debug.update({showCollisionBoxes:s})}).name("Show Collision Boxes"),n.add(o,"showEnvMap").onChange(s=>{e.Debug.update({showEnvMap:s})}).name("Show Environment Map"),e.Debug.update(o)}r(Pe,"createDebugControl");A();function He(t,e,i){let n=t.addFolder("Text3D").close(),a={all:r(()=>{e.Text3D.labelAll()},"all"),removeAll:r(()=>{e.Text3D.removeAll()},"removeAll")};n.add(a,"all").name("Show All"),n.add(a,"removeAll").name("Remove All")}r(He,"createText3DControl");A();A();A();var F,N,$,x,O,I,je,K,Ye,Ne=class{constructor(e=new ee({autoPlace:!0})){V(this,I),V(this,F),V(this,N,[]),V(this,$,{}),V(this,x,{}),V(this,O,{}),et(this,F,e),y(this,F).domElement.style.left="0"}add(e,i,n){if(y(this,x)[e])throw new Error("Control ".concat(e," already exists"));y(this,$)[e]=i,y(this,O)[e]=i.default,G(this,I,je).call(this,e,i,n),this.show()}addColor(e,i,n){if(y(this,x)[e])throw new Error("Control ".concat(e," already exists"));y(this,$)[e]=i,y(this,O)[e]=i.default,G(this,I,Ye).call(this,e,i,n),this.show()}update(e,i){if(!y(this,x)[e])throw new Error("Control ".concat(e," does not exist"));y(this,x)[e].setValue(i),y(this,$)[e].onChange&&y(this,$)[e].onChange(i,e)}replace(e,i,n){if(!y(this,x)[e]){this.add(e,i,n);return}i.args&&y(this,x)[e].options(i.args),i.default&&y(this,x)[e].setValue(i.default),i.onChange&&y(this,x)[e].onChange(a=>{i.onChange(a,e)})}remove(e){if(!y(this,x)[e])throw new Error("Control ".concat(e," does not exist"));y(this,x)[e].destroy(),y(this,x)[e].parent.children.length===0&&y(this,x)[e].parent.hide(),delete y(this,x)[e],delete y(this,$)[e],delete y(this,O)[e]}show(){y(this,F).show()}hide(){y(this,F).hide()}removeAll(){for(let e in y(this,x))this.remove(e)}destroy(){y(this,F).destroy()}};F=new WeakMap,N=new WeakMap,$=new WeakMap,x=new WeakMap,O=new WeakMap,I=new WeakSet,je=r(function(t,e,i){let n=G(this,I,K).call(this,i).add(y(this,O),t,e.args,e.max,e.step);e.onChange&&n.onChange(a=>{e.onChange(a,t)}),e.onAdd&&e.onAdd(e.default,t),y(this,x)[t]=n},"#addControl"),K=r(function(t){if(!t)return y(this,F);let e=y(this,N).find(i=>i._title===t);return e?(e.show(),e):(e=y(this,F).addFolder(t),y(this,N).push(e),e)},"#getFolder"),Ye=r(function(t,e,i){let n=G(this,I,K).call(this,i).addColor(y(this,O),t);e.onChange&&n.onChange(a=>{e.onChange(a,t)}),y(this,x)[t]=n},"#addColorControl"),r(Ne,"GUI");var pt=Ne;function Ge(t,e,i){var n;let a={},o=t.getByType("floor"),s=t.getByType("floor-stack");s.length>1&&(a.FloorStack={default:e.currentFloorStack.id,args:s.reduce((d,{id:p,name:c})=>L(M({},d),{[c]:p}),{}),onChange:r(d=>{d!==e.currentFloorStack.id&&(e.setFloorStack(d),i.replace("Floor",{default:e.currentFloor.id,args:e.currentFloorStack.floors.reduce((p,{id:c,name:f})=>L(M({},p),{[f]:c}),{})}))},"onChange")}),o.length>1&&(a.Floor={default:e.currentFloor.id,args:[...e.currentFloorStack.floors.sort((d,p)=>p.elevation-d.elevation)].reduce((d,{id:p,name:c})=>L(M({},d),{[c]:p}),{}),onChange:r(d=>{d!==e.currentFloor.id&&e.setFloor(d)},"onChange"),onAdd:r(()=>{e.on("floor-change",d=>{d!=null&&d.floor.id&&(s.length>1&&i.replace("FloorStack",{default:e.currentFloorStack.id}),i.replace("Floor",{default:e.currentFloor.id,args:e.currentFloorStack.floors.reduce((p,{id:c,name:f})=>L(M({},p),{[f]:c}),{})}))})},"onAdd")});let l=t.getByType("enterprise-venue");return l&&l.languages.length>1&&(a.Language={default:((n=t.currentLanguage)==null?void 0:n.code)||l.languages[0].code,args:l.languages.reduce((d,{code:p,name:c})=>L(M({},d),{[c]:p}),{}),onChange:r(d=>{t.changeLanguage(d)},"onChange")}),a}r(Ge,"createDefaultControls");function We(t,e,i=new ee){let n=new pt(i),a=Ge(t,e,n);Object.keys(a).length||n.hide();for(let o in a)n.add(o,a[o]);return n}r(We,"createGUI");async function Re(t,e,{initialfloorsInStack:i,root:n,floorsInDirections:a,showLabelsPerFloor:o=!0}){async function s(g){t.StackedMaps.changeFloorOnElevationChanges(!1),t.Outdoor.setOpacity(.15),t.StackedMaps.setFloorVisiblityMode("only-current-floor"),t.Camera.setPanMode("default"),await t.Camera.focusOn(g,{pitch:10})}r(s,"zoomToFloor");async function l(){t.Outdoor.setOpacity(.25),t.StackedMaps.changeFloorOnElevationChanges(!0),t.Camera.setPanMode("elevation"),t.StackedMaps.setFloorVisiblityMode("all-floors"),await t.Camera.focusOn(t.currentFloor,{axisAlignedPadding:{vertical:t.StackedMaps.distanceBetweenFloors},pitch:90})}r(l,"showCurrentFloorWithPadding");async function d(g){await t.Camera.animateElevation(g.elevation*t.StackedMaps.distanceBetweenFloors)}r(d,"scrollToFloor");let p=t.currentFloor;t.on("floor-change",async g=>{t.StackedMaps.expanded&&g.reason!=="stacked-maps-elevation-change"&&(t.StackedMaps.changeFloorOnElevationChanges(!1),t.StackedMaps.setFloorVisiblityMode("all-floors"),await t.Camera.focusOn(p,{axisAlignedPadding:{vertical:t.StackedMaps.distanceBetweenFloors},pitch:90,duration:500}),t.StackedMaps.changeFloorOnElevationChanges(!0),await d(t.currentFloor),await s(t.currentFloor),t.StackedMaps.setFloorVisiblityMode("only-current-floor")),p=t.currentFloor}),t.on("stacked-maps-state-change",({state:g})=>{console.log("stacked-maps-state-change",g)});let c=e.getByType("space");if(o){let g=c.reduce((h,b)=>(h.has(b.floor)||h.set(b.floor,[]),b.name&&b.name!==""&&h.get(b.floor).push(t.Labels.add(b,b.name)),h),new Map);t.on("floor-change",()=>{g.forEach((h,b)=>{h.forEach(u=>{t.updateState(u,{enabled:t.currentFloor===b})})})})}let f=We(e,t,n),m=i??[];async function v(){t.Outdoor.setOpacity(.25),m=e.getByType("floor"),await t.Camera.animateTo({pitch:90}),await t.StackedMaps.collapse(),t.StackedMaps.clearCachedFloorSeparationDistance(),await t.StackedMaps.expand({distanceBetweenFloors:"auto"})}return r(v,"expandAll"),f.add("Expand - All",{default:r(async()=>{await v()},"default")},"Stack Maps"),a&&f.add("Expand - Only Navigation",{default:r(async()=>{t.Outdoor.setOpacity(.25),m=a,await t.StackedMaps.collapse(),t.setFloor(a[0]),await t.StackedMaps.expand({includedFloors:a,distanceBetweenFloors:"auto"})},"default")},"Stack Maps"),f.add("Show All Floors",{default:r(async()=>{m=e.getByType("floor"),t.Outdoor.setOpacity(.25),t.StackedMaps.setFloorVisiblityMode("all-floors"),t.StackedMaps.changeFloorOnElevationChanges(!1),t.Camera.setPanMode("elevation"),t.Camera.focusOn(m,{pitch:90})},"default")},"Stack Maps"),f.add("Show Current Floor with padding",{default:r(async()=>{await l()},"default")},"Stack Maps"),f.add("Zoom to Current Floor",{default:r(async()=>{s(t.currentFloor)},"default")},"Stack Maps"),f.add("Collapse",{default:r(()=>{t.Outdoor.setOpacity("initial"),t.StackedMaps.collapse()},"default")},"Stack Maps"),f.add("Default",{default:r(async()=>{t.Camera.setPanMode("default")},"default")},"Camera Pan Mode"),f.add("Elevation",{default:r(async()=>{t.Camera.setPanMode("elevation")},"default")},"Camera Pan Mode"),f.add("zoom in to floor 2",{default:r(async()=>{t.Outdoor.setOpacity(.25),console.log(t.currentFloor.name),await t.Camera.focusOn(t.currentFloor,{axisAlignedPadding:{vertical:t.StackedMaps.distanceBetweenFloors},pitch:90}),t.StackedMaps.expanded||await t.StackedMaps.expand({distanceBetweenFloors:t.StackedMaps.distanceBetweenFloors});let g=t.StackedMaps.includedFloors[2],h=m.findIndex(b=>b.id===g.id);t.StackedMaps.changeFloorOnElevationChanges(!0),t.Camera.setPanMode("elevation"),t.StackedMaps.setFloorVisiblityMode("all-floors"),await t.Camera.animateElevation(h*t.StackedMaps.distanceBetweenFloors),t.Outdoor.setOpacity(.15),console.log("focusing on",g.name),await t.Camera.focusOn(g,{pitch:10}),t.StackedMaps.setFloorVisiblityMode("only-current-floor"),t.Camera.setPanMode("default"),t.StackedMaps.changeFloorOnElevationChanges(!1)},"default")},"Camera Pan Mode"),f.add("All Floors",{default:r(async()=>{t.StackedMaps.setFloorVisiblityMode("all-floors")},"default")},"Visibility Mode"),f.add("Only Active Floor",{default:r(async()=>{t.StackedMaps.setFloorVisiblityMode("only-current-floor")},"default")},"Visibility Mode"),f.add("Up",{default:r(async()=>{let g=m.find(h=>h.elevation===t.currentFloor.elevation+1);g&&await d(g)},"default")},"Floors Up/Down"),f.add("Down",{default:r(async()=>{let g=m.find(h=>h.elevation===t.currentFloor.elevation-1);g&&await d(g)},"default")},"Floors Up/Down"),{zoomToFloor:s,expandAll:v}}r(Re,"createStackMapsControl");function Ue(t,e,i){let n=t.addFolder("StackedMaps");n.close(),Re(e,i,{root:n,showLabelsPerFloor:!1})}r(Ue,"createStackmapsControl");function Je(t,e,i){Xe();let n=new Ce({title:"SDK Controls"});n.domElement.classList.add("mappedin-js-inspector"),Fe(e,t,n),Oe(n,e,i==null?void 0:i.camera);let a=n.addFolder("Levels").close(),o=n.addFolder("Scene Controls");o.close();let s=n.addFolder("Labels");He(n,e);let l=n.addFolder("Markers");Te(n,e),Ue(n,e,t);let d=n.addFolder("misc");Pe(n,e),ze(d,e,t);let p={level:e.currentFloor.id},{populatelabels:c}=$e(s,t,e),{populateMarkers:f}=Ve(l,t,e),m=t.getByType("floor").reduce((g,h)=>(g[h.name]=h.id,g),{}),v=a.add(p,"level",m).onChange(g=>{e.setFloor(g),p.level=e.currentFloor.id,v.updateDisplay()});return e.on("floor-change-start",g=>{a.controllers[0].setValue(g.floor.id)}),t.getByType("space").forEach(g=>{e.updateState(g,{interactive:!0})}),t.getByType("object").forEach(g=>{e.updateState(g,{interactive:!0})}),t.getByType("object").forEach(g=>{e.updateState(g,{interactive:!0})}),e.setHoverColor("#a2b7e6"),e.Camera.setMaxZoomLevel(20),{populatelabels:c,sceneFolder:o,populateMarkers:f}}r(Je,"createUi");var le="mappedin-sdk-debug-css";function Xe(){if(document.getElementById(le))return;let t=document.createElement("style");t.id=le,t.textContent=ut,document.head.appendChild(t)}r(Xe,"injectCss");var Ke=class{constructor(e,i){D(this,"_enabled",!1),D(this,"mv"),D(this,"api"),D(this,"mapData"),D(this,"scenegraphVisualizerMounted",!1),D(this,"storeStateToLocalStorageEnabled",!1),this.mv=e,this.api=i,this.mapData=this.api.getMapData()}setMapData(e){this.mapData=e}async enable(e={}){var i;if(this._enabled)return;if(this._enabled=!0,!this.mapData)throw new Error("Please set mapData before enable debug.");let{sceneFolder:n}=Je(this.mapData,this.mv,e);n.onOpenClose(a=>{a===n&&!a._closed&&!this.scenegraphVisualizerMounted&&(this.scenegraphVisualizerMounted=!0,Ze(this.api.core,n))}),(i=this.api.getMapDataInternal())==null||i.spaces.forEach(a=>{this.mv.updateState(a.id,{interactive:!0})})}get enabled(){return this._enabled}};r(Ke,"Inspector");var At=Ke;export{At as Inspector};
