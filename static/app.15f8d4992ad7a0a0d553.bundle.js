(e=>{var t={};function n(i){if(t[i])return t[i].exports;var l=t[i]={i,l:!1,exports:{}};return e[i].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.m=e,n.c=t,n.d=(e,t,i)=>{n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=(e,t)=>{if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)n.d(i,l,(t=>e[t]).bind(null,l));return i},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,"a",t),t},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.p="/",n(n.s=6)})([(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={throwOnError:!1,elementDelimiter:"__",modifierDelimiter:"_"};function l(e,t,n,l,s){var r=n&&"object"==typeof n,a=r?n:l,o=r?l:s,d=r?"":n,h=i.modifierDelimiter,c=i.throwOnError,u=d?""+t+i.elementDelimiter+d:t,_=e[u]||"";return a&&(_=Object.keys(a).reduce((t,n)=>{var i,l=a[n];if(void 0===l)return t;if("boolean"==typeof l){if(!l)return t;i=e[""+u+h+n]}else{var s=""+u+h+n+h+a[n];i=e[s]}return t+" "+i},_)),o&&(_=Object.keys(o).reduce((t,n)=>{if(!o[n])return t;var i=e["is-"+n];if(!i){if(c)throw Error("There is no is-"+n+" in cssModule");return t}return t+" "+i},_)),_.trim()}var s=(e,t)=>l.bind(null,e,t||(e=>{var t=Object.keys(e)[0],n=t.indexOf(i.elementDelimiter);-1!==n&&(t=t.slice(0,n));var l=t.indexOf(i.modifierDelimiter);return-1!==l&&(t=t.slice(0,l)),t})(e));s.setSettings=e=>Object.assign(i,e),t.default=s},(e,t,n)=>{e.exports={settings:"_1cIiY",settings__label:"_19BCw","settings__label-text":"_1swJ-",settings__input:"gXEsr"}},(e,t,n)=>{e.exports={"game-status":"reZE7","game-status_state_win":"_1Qbcz","game-status_state_in-progress":"_2Wdms","game-status_state_not-started":"_1Q3bf","game-status_state_fail":"_1DUz7"}},(e,t,n)=>{e.exports={field:"_10poZ",field_locked:"HZ_Pl"}},(e,t,n)=>{e.exports={cell:"pxyUi",cell_open:"_2wwoB",cell_close:"_2nTbE",cell_bomb:"_3PRJQ",cell_flag:"_2nKhp",cell_question:"oHTVa",cell_dead:"_2VUvb",cell_count_1:"lEzDG",cell_count_2:"_3utag",cell_count_3:"_1AAqD",cell_count_4:"_173H7",cell_count_5:"_1RWxi",cell_count_6:"_3Q4iU",cell_count_7:"_2p6jV",cell_count_8:"z2f4g"}},(e,t,n)=>{},function(e,t,n){"use strict";n.r(t),n(5);var i=n(0),l=n.n(i),s=n(1),r=n.n(s);const a=l()(r.a),o=a("label"),d=a("label-text");class h{constructor(e){this.element=document.createElement("label"),this.element.className=o,this.element.innerHTML=`\n      <span className="${d}">\n        ${e.title}\n      </span>\n      <input\n        type="number"\n        min="${e.min}"\n        max="${e.max}"\n        value="${e.value}"\n      >\n    `,this.input=this.element.querySelector("input"),this.input.addEventListener("input",e.onChange)}}class c{constructor(e,t){this._actions=t,this.element=document.createElement("form"),this.element.className=a(),this.element.addEventListener("submit",this),this._inputWidth=new h({min:"1",max:"10000",value:e.width,title:"Cols",onChange(t){e.width=parseInt(t.target.value,10)}}),this._inputHeight=new h({min:"1",max:"10000",value:e.height,title:"Rows",onChange(t){e.height=parseInt(t.target.value,10)}}),this._inputMinesCount=new h({min:"1",max:"10000",value:e.minesCount,title:"Mines count",onChange(t){e.minesCount=parseInt(t.target.value,10)}}),this.element.appendChild(this._inputWidth.element),this.element.appendChild(this._inputHeight.element),this.element.appendChild(this._inputMinesCount.element);const n=document.createElement("input");n.type="submit",n.value="Apply",this.element.appendChild(n)}handleEvent(e){e.preventDefault(),this._actions.onStart()}}var u=n(4),_=n.n(u);const m=(e,t,n)=>{const i=e%t==0,l=e%t==t-1,s=[];return e+t<n&&s.push(e+t),e-t>=0&&s.push(e-t),i||s.push(e-1,e+t-1,e-t-1),l||s.push(e+1,e+t+1,e-t+1),s.filter(e=>e>=0&&e<n)},f=l()(_.a);class p{constructor(){this.element=document.createElement("button"),this.element.type="button"}render(e,t){const n=Boolean(2&e),i=Boolean(1&e),l=e>>4,s={open:i||t&&n,close:!(i||t&&n),bomb:(i||t)&&n,dead:n&&i,flag:Boolean(4&e)&&!i,question:Boolean(8&e)&&!i};l&&i&&!n&&(s.count=l),this.element.className=f(s),this.element.disabled=i&&0===l,this.element.setAttribute("aria-label",(e=>4&e?"flag":8&e?"unknown mark":1&e?e>>4!=0?"around bombs "+(e>>4):"opened empty cell":"not oppened cell")(e)),this.element.textContent=i&&!n&&l?String(l):""}}var g=n(3),C=n.n(g);const b=l()(C.a),v=[13,32,40,38,37,39];class k{constructor(e,t){this._actions=e,this._isLockedEvents=!1,this._gameState=t,this._cells=[],this.element=document.createElement("div"),this.element.className=b(),this.element.addEventListener("click",this),this.element.addEventListener("contextmenu",this),this.element.addEventListener("dblclick",this),this.element.addEventListener("mouseup",this),this.element.addEventListener("keydown",this)}renderAll(){const e=document.createDocumentFragment();this._cells=[];for(let t=0;t<this._gameState.field.field.length;t++)this._cells[t]=new p,this._cells[t].render(this._gameState.field.field[t],this._gameState.field.showAllBombs),e.appendChild(this._cells[t].element);this.element.innerHTML="",this.element.style.width=34*this._gameState.game.width+"px",this.element.appendChild(e)}renderCell(e){this.element.className=b({locked:this._gameState.field.showAllBombs||"win"===this._gameState.game.state}),this._cells[e].render(this._gameState.field.field[e],this._gameState.field.showAllBombs)}handleEvent(e){if(e.preventDefault(),this._isLockedEvents)return;const t=e.target;if(!(t instanceof HTMLButtonElement))return;const n=t.parentElement;if(!n)return;const i=Array.prototype.indexOf.call(n.children,t);switch(e.type){case"click":this._hanldeClick(e,i);break;case"dblclick":this._hanldeDoubleClick(i);break;case"contextmenu":this._handleContextMenu(i);break;case"mouseup":this._handleMouseUp(e,i);break;case"keydown":this._handleKeyPress(e)}}_hanldeClick(e,t){this._openCellEvent(t,e.ctrlKey||e.altKey)}_hanldeDoubleClick(e){this._quickOpen(e)}_handleContextMenu(e){1&this._getCell(e)?this._actions.onClickQuickOpenCell(e):this._actions.onClickMarkCell(e)}_handleMouseUp(e,t){2===e.which&&this._quickOpen(t)}_handleKeyPress(e){const{keyCode:t}=e;if(!v.includes(t))return;const n=document.activeElement;if(!(n instanceof HTMLButtonElement))return;const i=n.parentElement;if(!i)return;e.preventDefault(),this._lockEvents(),clearTimeout(this._timer);const l=Array.prototype.indexOf.call(i.children,n);let s=-1;switch(t){case 32:this._handleContextMenu(l);break;case 13:this._openCellEvent(l,!1);break;case 37:s=this._getPrevAvailableId(l-1);break;case 39:s=this._getNextAvailableId(l+1);break;case 38:s=this._getPrevAvailableId(l-this._gameState.game.width);break;case 40:s=this._getNextAvailableId(l+this._gameState.game.width)}i.children[s]&&i.children[s].focus(),this._timer=setTimeout(()=>this._unlockEvents(),100)}_quickOpen(e){const t=this._getCell(e);1&t&&t>>8!=0&&this._actions.onClickQuickOpenCell(e)}_openCellEvent(e,t){const{onClickCell:n,onClickMarkCell:i,onClickQuickOpenCell:l}=this._actions,s=this._getCell(e),r=1&s,a=4&s,o=8&s;t?r?l(e):i(e):r||a||o||n(e)}_getCell(e){return this._gameState.field.field[e]}_getPrevAvailableId(e){for(;e>=0&&1&this._getCell(e)&&this._getCell(e)>>8==0;)e--;return e}_getNextAvailableId(e){for(;e<this._gameState.field.field.length&&1&this._getCell(e)&&this._getCell(e)>>8==0;)e++;return e}_lockEvents(){this._isLockedEvents=!0}_unlockEvents(){this._isLockedEvents=!1}}var w=n(2),y=n.n(w);const E=l()(y.a);class S{constructor(){this.element=document.createElement("div")}render(e){this.element.innerHTML=this.renderInfo(e),this.element.className=E("",{state:e.state})}renderMinesCount(e){return`\n      <span>\n        Mines left: \n      </span>\n      ${e}\n    `}renderWinStatus(e){return`\n      <span>\n        You Winner!!!\n      </span>\n      ${this.renderMinesCount(e)}\n    `}renderInProgress(e){return this.renderMinesCount(e)}renderFail(e){return this.renderMinesCount(e)}renderNotStarted(e){return this.renderMinesCount(e)}renderInfo(e){const{state:t}=e;return"win"===t?this.renderWinStatus(e.minesLeftCount):"in-progress"===t?this.renderInProgress(e.minesLeftCount):"fail"===t?this.renderFail(e.minesLeftCount):this.renderNotStarted(e.minesLeftCount)}}var x={game:{width:16,height:10,minesCount:30,state:"not-started"},field:{field:new Uint8Array,flagsCount:0,openedCount:0,showAllBombs:!1,isGenerated:!1}};new class{constructor(e){this._root=e,this._settings=new c(x.game,{onStart:()=>this.onStart()}),this._gameStatus=new S,this._field=new k({onClickCell:e=>{x.field.isGenerated||(x.field.field=((e,t,n,i)=>{const l=t*e,s=new Uint8Array(l);let r=l,a=n;for(let e=0;e<l;e++){const t=e!==i&&a>0&&Math.round(Math.random()*r)<a;r--,t&&a--,s[e]=t?2:0}for(let t=0;t<l;t++){let n=0;const i=m(t,e,l);for(const e of i)2&s[e]&&n++;s[t]|=n<<4}return s})(x.game.width,x.game.height,x.game.minesCount,e),x.field.isGenerated=!0),this._cellOpen(e),this._checkFinish(),this._gameStatus.render({minesLeftCount:x.game.minesCount-x.field.flagsCount,state:x.game.state})},onClickMarkCell:e=>{const t=x.field.field[e];8&t?this._updateCell(e,0,-9):4&t?(this._updateCell(e,8,-5),x.field.flagsCount--):(this._updateCell(e,4),x.field.flagsCount++),this._checkFinish()},onClickQuickOpenCell:e=>{const t=x.field.field[e];if(1&t&&t>>4!=0){let n=0;const i=m(e,x.game.width,x.field.field.length).filter(e=>{const t=x.field.field[e];return 4&t?(n++,!1):0==(9&t)});n===t>>4&&i.forEach(e=>{x.field.field[e]>>4!=0||2&x.field.field[e]?this._openCellState(e):this._openAllowedSiblings(e)})}this._checkFinish()}},x),this._root.appendChild(this._settings.element),this._root.appendChild(this._field.element),this._root.appendChild(this._gameStatus.element),this.onStart()}onStart(){var e,t;x.game.state="in-progress",x.field.field=(e=x.game.width,t=x.game.height,new Uint8Array(t*e)),x.field.isGenerated=!1,this._field.renderAll()}_cellOpen(e){const t=x.field.field[e];t>>4!=0||2&t?this._openCellState(e):this._openAllowedSiblings(e)}_openCellState(e){1&x.field.field[e]||(2&x.field.field[e]&&(x.field.showAllBombs=!0),x.field.openedCount++,this._updateCell(e,1))}_updateCell(e,t,n=255){x.field.field[e]|=t,x.field.field[e]&=n,this._field.renderCell(e)}_openAllowedSiblings(e){const t=x.game.width,{field:n}=x.field,i=n.length,l=new Uint8Array(i),s=[e];for(;s.length;){const e=s.pop();if(void 0===e)throw Error("currentId is undefined");if(l[e]=1,!(1&n[e])&&(this._updateCell(e,1),x.field.openedCount++,n[e]>>4==0)){const n=m(e,t,i);for(let e=n.length-1;e>=0;e--)l[n[e]]||s.push(n[e])}}}_checkFinish(){const{field:e,game:t}=x;e.showAllBombs&&"fail"!==t.state?this._onFinishGame(!0):"in-progress"!==t.state||e.flagsCount+e.openedCount!==e.field.length&&(e.field.length!==e.openedCount+t.minesCount||e.showAllBombs)||this._onFinishGame(!1)}_onFinishGame(e){x.game.state=e?"fail":"win",this._field.renderAll()}}(document.querySelector("#app"))}]);