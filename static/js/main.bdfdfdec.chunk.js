(this["webpackJsonpenstars-outfit-sorter"]=this["webpackJsonpenstars-outfit-sorter"]||[]).push([[0],[,,,,,,,,,,,,,function(e,t,a){e.exports=a.p+"static/media/instructions0.d5dad995.png"},function(e,t,a){e.exports=a.p+"static/media/instructions1.e918fb19.png"},function(e,t,a){e.exports=a.p+"static/media/instructions2.35bd47ff.PNG"},function(e,t,a){e.exports=a.p+"static/media/instructions3.819b73f6.PNG"},function(e,t,a){e.exports=a.p+"static/media/arrow_left_darkblue.76314777.svg"},function(e,t,a){e.exports=a.p+"static/media/arrow_up_darkblue.727d3630.svg"},function(e,t,a){e.exports=a.p+"static/media/arrow_down_darkblue.87e78f37.svg"},function(e,t,a){e.exports=a.p+"static/media/filter_darkblue.224365ea.svg"},function(e,t,a){e.exports=a.p+"static/media/platform.deae2014.svg"},,,function(e,t,a){e.exports=a(31)},,,,,function(e,t,a){},,function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(12),i=a.n(r),l=(a(29),a(10)),o=a(6),c=a(2),u=a(3),m=a(1),d=a(5),h=a(4),p=a(9),f=a(23),b=a(13),g=a.n(b),v=a(14),E=a.n(v),O=a(15),y=a.n(O),k=a(16),M=a.n(k),j=a(17),S=a.n(j),C=a(18),A=a.n(C),N=a(19),J=a.n(N),T=a(20),w=a.n(T),I=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={filters:null,isFilterMenu:!1},n.toggleFilterMenu=n.toggleFilterMenu.bind(Object(m.a)(n)),n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){var e=this.getSetsFromOutfitArray(this.props.data);this.setState({filters:e})}},{key:"getSetsFromOutfitArray",value:function(e){for(var t=this.props.filters,a=new Array(t.length),n=0;n<a.length;n++)a[n]=new Set;for(var s=0;s<t.length;s++)a[s].add(t[s]);for(var r=0;r<e.length;r++)for(var i=e[r],l=0;l<t.length;l++)a[l].add(i[t[l]]);return a}},{key:"toggleFilterMenu",value:function(){this.setState((function(e){return{isFilterMenu:!e.isFilterMenu}}))}},{key:"render",value:function(){var e=this;if(this.state.filters){var t={selAttr:this.props.selAttr,sortOutfits:this.props.sortOutfits},a=s.a.createElement(L,Object.assign({className:"hideOnPortraitSmall"},t)),n=s.a.createElement(L,Object.assign({className:"hideOnLandscape"},t));return s.a.createElement("div",{id:"sidebar",className:"toggledOn"},s.a.createElement("div",{className:"btn close",onClick:function(){e.setState({isFilterMenu:!1}),e.props.toggleOutfitList()}},s.a.createElement("img",{src:S.a,alt:"\u2190"})),s.a.createElement("span",{id:"status"},this.props.status),s.a.createElement("div",{className:"right"},a,s.a.createElement("div",{className:"btn toggleFilter",onClick:this.toggleFilterMenu},s.a.createElement("img",{src:w.a,alt:"filter options"}))),s.a.createElement(D,{isFilterMenu:this.state.isFilterMenu,filters:this.state.filters,sortMenu:n,toggleMade:this.props.toggleMade,selMade:this.props.selMade,submitFilterSelection:this.props.submitFilterSelection,toggleFilterMenu:this.toggleFilterMenu}))}return null}}]),a}(s.a.Component);function F(e){var t=Object(o.a)({},e);return t.src=e.up?A.a:J.a,t.alt=e.up?"\u2191":"\u2193",s.a.createElement("img",t)}var L=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={activeSort:"Total Bonus",isAscending:!1},n.toggleSort=n.toggleSort.bind(Object(m.a)(n)),n}return Object(u.a)(a,[{key:"toggleSort",value:function(e){var t=this;this.setState((function(t){return t.activeSort===e?{isAscending:!t.isAscending}:{activeSort:e,isAscending:!1}}),(function(){t.props.sortOutfits(e,t.state.isAscending)}))}},{key:"render",value:function(){var e=this,t=this.props.selAttr.map((function(t){return s.a.createElement(U,{key:t,opt:t,isActive:t===e.state.activeSort,isAscending:e.state.isAscending,onClick:function(){return e.toggleSort(t)}})}));return t.unshift(s.a.createElement(U,{key:"Total Bonus",opt:"Total",isActive:"Total Bonus"===this.state.activeSort,isAscending:this.state.isAscending,onClick:function(){return e.toggleSort("Total Bonus")}})),s.a.createElement("div",{id:"sortMenu",className:this.props.className?this.props.className:null},t)}}]),a}(s.a.Component);function U(e){return s.a.createElement("div",{className:"btn sortOpt"+(e.isActive?" active":""),onClick:e.onClick},s.a.createElement("span",{className:"arrow",style:{width:"0.7rem",height:"1rem"}},e.isActive&&s.a.createElement(F,{up:e.isAscending})),"Total"!==e.opt?s.a.createElement(de,{attr:e.opt}):s.a.createElement("span",null,e.opt))}function B(e){return s.a.createElement("div",{className:"radioBtn",id:"toggleMade"},s.a.createElement("input",{type:"checkbox",checked:!!e.selMade.size,onChange:e.toggleMade}),s.a.createElement("label",{htmlFor:"toggleMade"},"Only made outfits"))}var D=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={activeMenu:""},n.toggleMenu=n.toggleMenu.bind(Object(m.a)(n)),n}return Object(u.a)(a,[{key:"toggleMenu",value:function(e){this.setState((function(t){return{activeMenu:t.activeMenu===e?"":e}}))}},{key:"render",value:function(){var e=this,t=this.props.filters.map((function(t){var a=Array.from(t)[0],n="sel"+a;return s.a.createElement(x,{key:a,heading:a,isMenuActive:e.state.activeMenu===a,toggleMenu:function(){return e.toggleMenu(a)},optionsArr:Array.from(t),submitSelection:e.props.submitFilterSelection(n)})}));return s.a.createElement("div",{id:"filterMenu",className:"overlayContent",style:{display:this.props.isFilterMenu?"flex":"none"}},s.a.createElement("div",{className:"topContainer"},s.a.createElement("h4",{className:"hideOnLandscape"},"Sort by..."),this.props.sortMenu,s.a.createElement("h4",null,"Filter by..."),this.props.toggleMade&&s.a.createElement(B,{selMade:this.props.selMade,toggleMade:this.props.toggleMade}),s.a.createElement("div",{id:"filters"},t)),s.a.createElement("div",{className:"bottomContainer"},s.a.createElement("div",{className:"btn",onClick:this.props.toggleFilterMenu},"Close")))}}]),a}(s.a.PureComponent),x=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={selected:new Set,submitted:new Set},n.toggleOption=n.toggleOption.bind(Object(m.a)(n)),n.clearSelect=n.clearSelect.bind(Object(m.a)(n)),n.selectAll=n.selectAll.bind(Object(m.a)(n)),n.clearFilter=n.clearFilter.bind(Object(m.a)(n)),n.submitSelection=n.submitSelection.bind(Object(m.a)(n)),n}return Object(u.a)(a,[{key:"toggleOption",value:function(e){var t=this.state.selected;this.state.selected.has(e)?t.delete(e):t.add(e),this.setState({selected:t})}},{key:"clearSelect",value:function(){this.setState({selected:new Set,submitted:new Set})}},{key:"selectAll",value:function(){var e=this.props.optionsArr.slice(),t=e.indexOf(this.props.heading);e.splice(t,1),this.setState({selected:new Set(e)})}},{key:"clearFilter",value:function(){this.clearSelect(),this.props.submitSelection(new Set)}},{key:"submitSelection",value:function(){var e=Array.from(this.state.selected).concat(Array.from(this.state.submitted));this.setState({submitted:new Set(e)}),this.props.submitSelection(this.state.selected)}},{key:"render",value:function(){return s.a.createElement("div",{className:"filter"},s.a.createElement("div",{className:"filterHeading"},s.a.createElement(F,{className:"filterIcon",onClick:this.props.toggleMenu,up:this.props.isMenuActive}),s.a.createElement("p",{onClick:this.props.toggleMenu},this.props.heading),this.state.submitted.size>0&&s.a.createElement("a",{onClick:this.clearFilter},"clear filter")),this.props.isMenuActive&&s.a.createElement(R,{heading:this.props.heading,optionsArr:this.props.optionsArr,selected:this.state.selected,submitted:this.state.submitted,submitSelection:this.submitSelection,toggleMenu:this.props.toggleMenu,toggleOption:this.toggleOption,clearSelect:this.clearSelect,selectAll:this.selectAll}))}}]),a}(s.a.Component),R=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(u.a)(a,[{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"filterOptions"},s.a.createElement("div",null,s.a.createElement("span",{className:"btn submit",onClick:function(){e.props.toggleMenu(),e.props.submitSelection()}},"OK")),s.a.createElement(P,{heading:this.props.heading,optionsArr:this.props.optionsArr,selected:this.props.selected,submitted:this.props.submitted,toggleOption:this.props.toggleOption}),s.a.createElement("div",null))}}]),a}(s.a.Component);function P(e){var t=e.optionsArr.slice(0).sort();t.indexOf(e.heading)>-1&&t.splice(t.indexOf(e.heading),1),e.submitted.size>0&&t.sort((function(t,a){return e.submitted.has(t)===e.submitted.has(a)?0:e.submitted.has(t)?-1:e.submitted.has(a)?1:void 0}));var a=t.map((function(t){return s.a.createElement("li",{key:t,className:e.selected.has(t)?"selected":"",onClick:function(){return e.toggleOption(t)}},s.a.createElement("div",null,s.a.createElement("span",null),t))}));return s.a.createElement("ul",null,a)}function H(e){var t,a,r=Object(n.useState)(null),i=Object(f.a)(r,2),l=i[0],o=i[1],c=(t=l,a=o,function(e){a(t===e?null:e)});return s.a.createElement("div",{className:"overlay"},s.a.createElement("div",{className:"overlayContent",id:"instructions"},s.a.createElement("div",{className:"topContainer"},s.a.createElement("div",{className:"top"},s.a.createElement("h3",null,"Don't see your outfit?"),s.a.createElement("p",null,"Add it to the ",s.a.createElement("a",{target:"_blank",href:"https://docs.google.com/spreadsheets/d/1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU/edit#gid=0"},"outfit database spreadsheet!")),s.a.createElement("p",null,"If you don't see a specific outfit, it's because the database currently doesn't have information for it. Please add its stats to the database and refresh the outfit sorter."),s.a.createElement("hr",null),s.a.createElement("h3",null,"How to import user data"),s.a.createElement("p",null,"Make a copy of this ",s.a.createElement("a",{target:"_blank",href:"https://docs.google.com/spreadsheets/d/1asGXfBIw2qe3xYX_mawgbjO34gYqsj6IBNRbzqtqNAQ/"},"Google spreadsheet template")," and fill it with your outfits."),s.a.createElement("ul",null,s.a.createElement("p",null,s.a.createElement("strong",null,"Notes on the spreadsheet format")),s.a.createElement("li",null,s.a.createElement("strong",null,"Must have:")," a sheet named Outfits with columns labeled Character, Outfit, and Made."),s.a.createElement("li",null,s.a.createElement("strong",null,"Optional: ")," the Idol Status sheet and Validation Lists sheet"),s.a.createElement("li",null,"The character and outfit names should match the spelling and translations in the database's ",s.a.createElement("a",{target:"_blank",href:"https://docs.google.com/spreadsheets/d/1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU/edit#gid=350164119"},"Validation Lists"),".")),s.a.createElement("p",null,s.a.createElement("strong",null,"Turn link sharing on for the spreadsheet.")," Otherwise the sorter will not be able to access the contents."),s.a.createElement("ul",null,s.a.createElement("p",{className:"sharingHeading",onClick:function(){return c("desktop")}},s.a.createElement(F,{className:"arrow",up:"desktop"===l}),s.a.createElement("strong",null,"On desktop")),"desktop"===l&&s.a.createElement(s.a.Fragment,null,s.a.createElement("li",null,s.a.createElement("p",null,"Click the 'Share' button in the top right corner and click 'Get shareable link'."),s.a.createElement("img",{src:g.a,alt:"Turn on link sharing"})),s.a.createElement("li",null,s.a.createElement("p",null,"Copy the provided link."),s.a.createElement("img",{src:E.a,alt:"Copy link"})))),s.a.createElement("ul",null,s.a.createElement("p",{className:"sharingHeading",onClick:function(){return c("mobileApp")}},s.a.createElement(F,{className:"arrow",up:"mobileApp"===l}),s.a.createElement("strong",null,"On Sheets mobile app")),"mobileApp"===l&&s.a.createElement(s.a.Fragment,null,s.a.createElement("li",null,s.a.createElement("p",null,"Open the spreadsheet settings and tap 'Share & export'."),s.a.createElement("img",{src:y.a,alt:"Open mobile settings"})),s.a.createElement("li",null,s.a.createElement("p",null,"Turn 'Link sharing' on and copy the link."),s.a.createElement("img",{src:M.a,alt:"Turn link sharing on"})))),s.a.createElement("p",null,"Copy the spreadsheet link into the sorter and click 'Add'."))),s.a.createElement("div",{className:"bottomContainer"},s.a.createElement("div",{className:"btn",onClick:e.toggleInstructions},"Close"))))}var V=a(21),_=a.n(V),q=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={isInstructions:!1},n.toggleInstructions=n.toggleInstructions.bind(Object(m.a)(n)),n}return Object(u.a)(a,[{key:"toggleInstructions",value:function(){this.setState((function(e){return{isInstructions:!e.isInstructions}}))}},{key:"render",value:function(){var e=this;if(this.props.activeJob&&this.props.teamMembers.length>0){var t=this.props.teamMembers.map((function(t,a){return s.a.createElement(z,{key:a,index:a,member:t,selAttr:e.props.selAttr,toggleOutfitList:e.props.toggleOutfitList})})),a=s.a.createElement("div",{className:"btn addData",onClick:function(){return e.props.getUserData(document.querySelector("#userData").value)}},"Add"),n=s.a.createElement("div",{className:"btn help",onClick:this.toggleInstructions},"?");this.props.sheetId;return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{id:"topMenu"},s.a.createElement("span",null,"spreadsheet: "),s.a.createElement("input",{id:"userData",type:"text",defaultValue:this.props.sheetId}),a,n),s.a.createElement("div",{id:"teamViewContainer"},s.a.createElement("div",{id:"teamView"},t)),this.state.isInstructions&&s.a.createElement(H,{toggleInstructions:this.toggleInstructions}))}return null}}]),a}(s.a.Component);function z(e){var t="teamMember"+(e.member.hasOwnProperty("Made")?e.member.Made?"":" notMade":"");return s.a.createElement("div",{className:t,onClick:function(){return e.toggleOutfitList(e.index)}},s.a.createElement("div",{className:"imgContainer"},s.a.createElement(G,{hasMember:e.member}),s.a.createElement(ce,{obj:e.member})),s.a.createElement(ue,{attr:e.selAttr,bonus:e.member,maxValue:300,hideIcon:!0}))}function G(e){return s.a.createElement(s.a.Fragment,null,s.a.createElement("img",{className:"platform",src:_.a}),e.hasMember?s.a.createElement("div",{className:"shadow"}):null)}var Y=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={isJobList:!1},n.toggleJobList=n.toggleJobList.bind(Object(m.a)(n)),n}return Object(u.a)(a,[{key:"toggleJobList",value:function(){this.setState((function(e,t){return{isJobList:!e.isJobList}}))}},{key:"render",value:function(){if(this.props.activeJob){var e={attr:this.props.attr,activeJob:this.props.activeJob,teamMembers:this.props.teamMembers,toggleJobList:this.toggleJobList},t={jobs:this.props.jobs,attr:this.props.attr,activeJob:this.props.activeJob,selectJob:this.props.selectJob,toggleJobList:this.toggleJobList};return s.a.createElement("div",{id:"jobView"},s.a.createElement(Q,e),s.a.createElement("div",{className:"overlay",style:{display:this.state.isJobList?"flex":"none"}},s.a.createElement(X,t)))}return null}}]),a}(s.a.PureComponent),Q=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){return Object(c.a)(this,a),t.call(this,e)}return Object(u.a)(a,[{key:"render",value:function(){var e=this,t=s.a.createElement("div",{className:"btn selectJob",onClick:this.props.toggleJobList},"Change Job"),a=this.props.attr.filter((function(t){return e.props.activeJob[t]>0})),n={},r={};return a.forEach((function(t){n[t]=e.props.activeJob[t],r[t]=e.props.teamMembers.reduce((function(e,a){return a?e+a[t]:e}),0)})),s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"header"},s.a.createElement("div",{className:"title"},s.a.createElement("p",null,this.props.activeJob["Job JP"]),t),s.a.createElement("hr",null),s.a.createElement("div",{className:"statInfo"},s.a.createElement(ce,{obj:this.props.activeJob,alt:this.props.activeJob.Job}),s.a.createElement(ue,{maxValue:1500,attr:a,value:r,baseline:n}))),s.a.createElement("div",{className:"workResult"},s.a.createElement(W,{baseline:n,value:r})))}}]),a}(s.a.PureComponent);function W(e){var t=Object.keys(e.baseline).reduce((function(t,a){var n=e.value[a]/e.baseline[a]*(1/3);return t+Math.min(n,1/3)}),0);return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{id:"progressBarContainer"},s.a.createElement("span",{id:"progressBarHide",style:{width:"".concat(100*(1-t),"%")}}),s.a.createElement("span",{id:"progressBar",style:{width:"100%"}})),s.a.createElement("div",{className:"status"},"Work Result: ".concat(Math.floor(100*t),"%")))}var X=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={menus:{Beginner:"\u3010\u521d\u7d1a\u3011",Intermediate:"\u3010\u4e2d\u7d1a\u3011",Advanced:"\u3010\u4e0a\u7d1a\u3011",Unit:"Unit","ES Building":"ES\u30d3\u30eb",Limited:"\u671f\u9593\u9650\u5b9a"},activeMenu:null,viewJob:null},n.toggleProperty=n.toggleProperty.bind(Object(m.a)(n)),n.toggleMenu=n.toggleMenu.bind(Object(m.a)(n)),n.getAvailableMenus=n.getAvailableMenus.bind(Object(m.a)(n)),n.getMenuJobs=n.getMenuJobs.bind(Object(m.a)(n)),n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){this.setState({activeMenu:this.props.activeJob.Type,viewJob:this.props.activeJob})}},{key:"toggleProperty",value:function(e,t){this.setState(Object(p.a)({},e,t))}},{key:"toggleMenu",value:function(e){var t=this.getMenuJobs(e)[0];this.setState({activeMenu:e,viewJob:t})}},{key:"getAvailableMenus",value:function(){var e=this,t=Object.keys(this.state.menus),a={},n=new Set(this.props.jobs.map((function(e){return e.Type?e.Type.trim():""})));return t.forEach((function(t){t.length>0&&n.has(t)&&(a[t]=e.state.menus[t])})),a}},{key:"getMenuJobs",value:function(e){return this.props.jobs.filter((function(t){return!!t.Type&&t.Type.trim()===e}))}},{key:"render",value:function(){var e=this,t=s.a.createElement("div",{className:"btn selectJob",onClick:function(){e.props.selectJob(e.state.viewJob),e.props.toggleJobList()}},"Select Job");return this.state.viewJob&&s.a.createElement("div",{className:"overlayContent",id:"jobList"},s.a.createElement("div",{className:"bottom left"},s.a.createElement(Z,{menus:this.getAvailableMenus(),activeMenu:this.state.activeMenu,toggleMenu:this.toggleMenu}),s.a.createElement(K,{jobs:this.getMenuJobs(this.state.activeMenu),viewJob:this.state.viewJob,toggleProperty:this.toggleProperty})),s.a.createElement("div",{className:"top right"},s.a.createElement($,{job:this.state.viewJob,attr:this.props.attr,button:t,toggleJobList:this.props.toggleJobList})))}}]),a}(s.a.Component);function Z(e){var t=Object.keys(e.menus).map((function(t){return s.a.createElement("div",{key:t,className:"jobTab"+(e.activeMenu===t?" selected":""),onClick:function(){return e.toggleMenu(t)}},e.menus[t])}));return s.a.createElement("div",{id:"jobTabMenu"},t)}function K(e){var t=e.jobs.map((function(t){var a=e.viewJob.Job===t.Job,n=t["Job JP"]+(a?" selected":"");return s.a.createElement("div",{key:n,className:"jobOpt"+(a?" selected":""),onClick:function(){return e.toggleProperty("viewJob",t)}},t["Job JP"])}));return s.a.createElement("div",{id:"jobSelect"},t)}function $(e){var t=e.attr.filter((function(t){return e.job[t]>0})),a={};t.forEach((function(t){return a[t]=e.job[t]}));var n=s.a.createElement("div",{className:"btn closeJob",onClick:e.toggleJobList},"Cancel");return s.a.createElement("div",{id:"jobDetail"},s.a.createElement("p",null,e.job["Job JP"]),s.a.createElement(ce,{obj:e.job,alt:e.job.Job}),s.a.createElement(ue,{maxValue:1500,attr:t,value:a}),s.a.createElement("div",{className:"jobDetailBtns"},e.button,n))}var ee=a(22),te=a.n(ee),ae=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={error:!1,isLoading:!1,hasMore:!0,loadedOutfits:[],outfitsToLoad:30},n.onScroll=n.onScroll.bind(Object(m.a)(n)),n.loadOutfits=n.loadOutfits.bind(Object(m.a)(n)),n.onScrollThrottled=te()(n.onScroll,100),n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){this.loadOutfits()}},{key:"onScroll",value:function(e){e.persist(),!this.state.isLoading&&this.state.hasMore&&e.target&&window.innerHeight+e.target.scrollTop>=e.target.scrollHeight-600&&this.loadOutfits()}},{key:"loadOutfits",value:function(){var e=this;this.setState({isLoading:!0},(function(){e.setState((function(e,t){var a=e.loadedOutfits;return{hasMore:(a=a.concat(t.outfits.slice(e.loadedOutfits.length,e.loadedOutfits.length+e.outfitsToLoad))).length<t.outfits.length,isLoading:!1,loadedOutfits:a}}))}))}},{key:"render",value:function(){for(var e=this,t=this.state.loadedOutfits.map((function(t){var a=!1;return e.props.teamMembers.forEach((function(e){e.Character===t.Character&&e.Outfit===t.Outfit&&(a=!0)})),s.a.createElement(ne,{key:t.Character+t.Outfit+t["Total Bonus"],info:t,inTeam:a,selAttr:e.props.selAttr,setMember:e.props.setMember})})),a=[],n=0;n<4;n++)a.push(s.a.createElement("div",{key:n,className:"outfit-placeholder"}));return s.a.createElement("div",{id:"outfitView",onScroll:this.onScrollThrottled},s.a.createElement("div",{id:"outfitList",className:this.props.view},t,"card"===this.props.view&&a),!this.state.hasMore&&"card"===this.props.view&&s.a.createElement("p",{className:"status"},"End of results"))}}]),a}(s.a.PureComponent);function ne(e){var t="outfitCard"+(e.info.hasOwnProperty("Made")?e.info.Made?"":" notMade":"");return s.a.createElement("div",{className:t,onClick:function(){return e.setMember(e.info)}},e.inTeam&&s.a.createElement("div",{className:"inTeam"},"TEAM"),s.a.createElement("p",null,e.info.Character),s.a.createElement("p",null,e.info.Outfit),s.a.createElement("hr",null),s.a.createElement("div",{className:"rowContainer"},s.a.createElement(ce,{obj:e.info,alt:"".concat(e.info.Character," ").concat(e.info.Outfit)}),s.a.createElement("div",{className:"right"},s.a.createElement(ue,{attr:e.selAttr,bonus:e.info,maxValue:300}),"Total Bonus"in e.info&&s.a.createElement("div",{className:"bonus"},"TOTAL: ",s.a.createElement("strong",null,e.info["Total Bonus"])))))}var se="AIzaSyBYN0YVkl2lB5ps2CL_74JKIs5TOukXdm4",re="1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU";function ie(e,t){return Object.keys(e).map((function(a){var n=a.replace("sel",""),s=e[a],r=t[n];if(s.has(r))return!0}))}function le(e){for(var t=[],a=e[0],n=1;n<e.length;n++){for(var s=e[n],r={},i=0;i<s.length;i++){var l=a[i],o=s[i];isNaN(o)||(o=Number(o)),r[l]=o}t.push(r)}return t}var oe=function(e){Object(d.a)(a,e);var t=Object(h.a)(a);function a(){var e;return Object(c.a)(this,a),(e=t.call(this)).state={allOutfits:null,userOutfits:null,outfits:null,userSheetId:null,idolStats:null,attr:["Ac","Pa","Un","Sm","Te","Ch"],selAttr:[],jobs:null,activeJob:null,filters:null,isInclusive:!1,isOutfitList:!1,teamMembers:[],teamSlot:null},e.prepareOutfitData=e.prepareOutfitData.bind(Object(m.a)(e)),e.submitFilterSelection=e.submitFilterSelection.bind(Object(m.a)(e)),e.calculateTotalBonus=e.calculateTotalBonus.bind(Object(m.a)(e)),e.toggleSearchTypeTrue=e.toggleSearchTypeTrue.bind(Object(m.a)(e)),e.toggleSearchTypeFalse=e.toggleSearchTypeFalse.bind(Object(m.a)(e)),e.toggleMade=e.toggleMade.bind(Object(m.a)(e)),e.sortByFilter=e.sortByFilter.bind(Object(m.a)(e)),e.sortOutfits=e.sortOutfits.bind(Object(m.a)(e)),e.toggleOutfitList=e.toggleOutfitList.bind(Object(m.a)(e)),e.selectJob=e.selectJob.bind(Object(m.a)(e)),e.setMember=e.setMember.bind(Object(m.a)(e)),e.getUserData=e.getUserData.bind(Object(m.a)(e)),e}return Object(u.a)(a,[{key:"componentDidMount",value:function(){var e=this;fetch("https://sheets.googleapis.com/v4/spreadsheets/".concat(re,"/values/").concat("Jobs","?key=").concat(se)).then((function(e){return e.json()})).then((function(t){var a=le(t.values);e.setState({jobs:a});for(var n=0;"Beginner"!==a[n].Type;)n++;e.selectJob(a[n])})).then((function(){fetch("https://sheets.googleapis.com/v4/spreadsheets/".concat(re,"/values/").concat("Stat Bonuses","?key=").concat(se)).then((function(e){return e.json()})).then((function(t){var a=t.values,n={},s=[];a[0].forEach((function(t){"ImageID"===t||"Total"===t||e.state.attr.includes(t)||(s.push(t),n["sel"+t]=new Set)}));var r=le(a);r=e.filterIfColumnIsEmpty(r,["Unit","Character","Outfit"]),n.allOutfits=r,n.outfits=e.prepareOutfitData(r,e.state),n.filters=s,e.setState(n)}))}))}},{key:"filterIfColumnIsEmpty",value:function(e,t){return e.filter((function(e){return t.map((function(t){return!!e[t]})).reduce((function(e,t){return e&&t}),!0)}))}},{key:"toggleOutfitList",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.setState((function(t){return{isOutfitList:!t.isOutfitList,teamSlot:e}}))}},{key:"selectJob",value:function(e){var t=this;if(this.state.activeJob!==e){var a=Object(o.a)({},this.state);a.activeJob=e,a.teamMembers=new Array(e["Idol Slots"]).fill(0);var n=this.state.userOutfits?this.state.userOutfits:this.state.allOutfits;a.selAttr=Object.keys(e).filter((function(a){return t.state.attr.includes(a)&&e[a]>0})),this.state.outfits&&(a.outfits=this.prepareOutfitData(n,a)),this.setState(a)}}},{key:"toggleSearchTypeTrue",value:function(){this.setState({isInclusive:!0})}},{key:"toggleSearchTypeFalse",value:function(){this.setState({isInclusive:!1})}},{key:"toggleMade",value:function(){var e=null;e=0===this.state.selMade.size?new Set([!0]):new Set,this.submitFilterSelection("selMade")(e)}},{key:"sortByFilter",value:function(e,t){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];e.sort((function(e,n){return a?e[t]-n[t]:n[t]-e[t]}))}},{key:"sortOutfits",value:function(e,t){var a=this;this.setState((function(n,s){var r=Object(l.a)(n.outfits);return a.sortByFilter(r,e,t),{outfits:r}}))}},{key:"setMember",value:function(e){this.setState((function(t,a){for(var n=t.teamMembers.slice(),s=t.teamSlot,r=0;r<n.length;r++)if(e.Character===n[r].Character){s=r;break}return n[s]=e,{teamMembers:n,isOutfitList:!1}}))}},{key:"submitFilterSelection",value:function(e){var t=this;return function(a){t.setState((function(n){var s=Object(o.a)({},n);s[e]=a;var r=s.userOutfits?s.userOutfits:s.allOutfits,i=t.prepareOutfitData(r,s);return s.outfits=i,s}))}}},{key:"prepareOutfitData",value:function(e,t){var a=this.getQueryAndConditions(t);a.isInclusive=t.isInclusive;var n=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.query||{},n=t.conditions||[],s=t.isInclusive||!1,r=[];if(e){for(var i=function(t){var i=e[t],l=n.length<=0,o=Object.keys(a).length<=0;if(0===Object.keys(a).length&&0===n.length)o=!0;else if(n.length>0&&n.forEach((function(e){Object.values(i).includes(e)&&(l=!0)})),Object.keys(a).length>0){var c=ie(a,i);o=s?c.reduce((function(e,t){return e||t}),!1):c.reduce((function(e,t){return e&&t}),!0)}l&&o&&r.push(JSON.parse(JSON.stringify(i)))},l=0;l<e.length;l++)i(l);return r}}(e,a);return n=this.addIdolStatus(n,t.idolStats),t.selAttr.length>0&&(n=this.calculateTotalBonus(n,t.selAttr),this.sortByFilter(n,"Total Bonus",!1)),n}},{key:"getQueryAndConditions",value:function(e){return{query:Object.keys(e).reduce((function(t,a){var n=e[a];return a.includes("sel")&&"selAttr"!==a&&n.size>0&&(t[a]=n),t}),{}),conditions:e.activeJob&&e.activeJob.Conditions?e.activeJob.Conditions.split(",").map((function(e){return e.trim()})):[]}}},{key:"calculateTotalBonus",value:function(e,t){return e.forEach((function(e){var a=0;t.forEach((function(t){return a+=e[t]})),e["Total Bonus"]=a})),e}},{key:"addIdolStatus",value:function(e,t){return t&&e.forEach((function(e){var a=t[e.Character];a&&!e.AddedStat&&(Object.keys(a).forEach((function(t){e.hasOwnProperty(t)&&(e[t]+=a[t])})),e.AddedStat=!0)})),e}},{key:"getUserData",value:function(e){var t=this;if(e.length>0){var a=e.replace("https://docs.google.com/spreadsheets/d/",""),n=a.indexOf("/")>0?a.slice(0,a.indexOf("/")):a;fetch("https://sheets.googleapis.com/v4/spreadsheets/".concat(n,"/values/","Outfits","?key=").concat(se)).then((function(e){return e.json()})).then((function(e){return t.handleErrors(e)})).then((function(e){if(e){var a=e.values,n=a[0].map((function(e){return e.toUpperCase()}));if(n.includes("CHARACTER")&&n.includes("OUTFIT")&&n.includes("MADE")){a[0]=n;var s=le(a);return(s=s.filter((function(e){return e.CHARACTER&&e.OUTFIT}))).sort((function(e,t){return e.CHARACTER.toUpperCase()===t.CHARACTER.toUpperCase()?e.OUTFIT.toUpperCase()<t.OUTFIT.toUpperCase()?-1:e.OUTFIT.toUpperCase()>t.OUTFIT.toUpperCase()?1:0:e.CHARACTER.toUpperCase()<t.CHARACTER.toUpperCase()?-1:e.CHARACTER.toUpperCase()>t.CHARACTER.toUpperCase()?1:0})),Object(l.a)(t.state.allOutfits).reduce((function(e,t){for(var a=!1,n=0,r=s.length-1;!a&&!(r<n);){var i=Math.floor(n+(r-n)/2);s[i].CHARACTER.toUpperCase()===t.Character.toUpperCase()?s[i].OUTFIT.toUpperCase()<t.Outfit.toUpperCase()?n=i+1:s[i].OUTFIT.toUpperCase()>t.Outfit.toUpperCase()?r=i-1:a=s[i]:s[i].CHARACTER.toUpperCase()<t.Character.toUpperCase()?n=i+1:s[i].CHARACTER.toUpperCase()>t.Character.toUpperCase()&&(r=i-1)}return a?(Object.keys(a).includes("MADE")&&(t.Made="TRUE"===a.MADE),e.push(t),e):e}),[])}t.handleErrors({error:{status:"HEADER NOT FOUND"}})}})).then((function(e){e&&t.setState((function(a){var s=a.teamMembers.map((function(e){return 0})),r=t.prepareOutfitData(e,a);return{userSheetId:n,userOutfits:e,outfits:r,teamMembers:s,selMade:new Set}}))})).then(fetch("https://sheets.googleapis.com/v4/spreadsheets/".concat(n,"/values/","Idol Status","?key=").concat(se)).then((function(e){return e.json()})).then((function(e){if(e.values){var a=le(e.values),n={};a.forEach((function(e){var t=e.Character;delete e.Character,n[t]=e}));var s=Object(o.a)({},t.state);s.idolStats=n;var r=t.prepareOutfitData(t.state.outfits,s);s.outfits=r,t.setState(s)}})))}}},{key:"handleErrors",value:function(e){if(!e.error)return e;403===e.error.code&&e.error.status.includes("PERMISSION_DENIED")?console.log("Error: Sorter did not have permission to access your spreadsheet. Don't forget to turn link-sharing on!"):400===e.error.code&&e.error.status.includes("INVALID_ARGUMENT")?console.log("Error: Sorter did not find a sheet called 'Outfits' in your spreadsheet."):"HEADER NOT FOUND"!==e.error.status||console.log("Error: Sorter did not find 'Character', 'Outfit', and 'Made' columns in your spreadsheet.")}},{key:"render",value:function(){if(this.state.outfits&&this.state.jobs){var e=this.state.outfits.slice(0,100);e=JSON.stringify(e);var t={activeJob:this.state.activeJob,teamMembers:this.state.teamMembers,jobs:this.state.jobs,attr:this.state.attr,selAttr:this.state.selAttr,selectJob:this.selectJob},a={sheetId:this.state.userSheetId,selAttr:this.state.selAttr,activeJob:this.state.activeJob,teamMembers:this.state.teamMembers,toggleOutfitList:this.toggleOutfitList,getUserData:this.getUserData},n={key:e,outfits:this.state.outfits,teamMembers:this.state.teamMembers,view:this.state.view,attr:this.state.attr,selAttr:this.state.selAttr,setMember:this.setMember,toggleOutfitList:this.toggleOutfitList},r={selAttr:this.state.selAttr,selMade:this.state.selMade,data:this.state.allOutfits,filters:this.state.filters,status:"showing ".concat(this.state.outfits.length," outfits"),submitFilterSelection:this.submitFilterSelection,toggleTrue:this.toggleSearchTypeTrue,toggleFalse:this.toggleSearchTypeFalse,toggleMade:this.state.hasOwnProperty("selMade")&&this.toggleMade,toggleOutfitList:this.toggleOutfitList,sortOutfits:this.sortOutfits};return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{id:"teamBuilder"},s.a.createElement(q,a),this.state.activeJob&&s.a.createElement(Y,t)),s.a.createElement("div",{className:"overlay",style:{display:this.state.isOutfitList?"flex":"none"}},s.a.createElement("div",{className:"overlayContent"},s.a.createElement(I,r),s.a.createElement(ae,n))))}return s.a.createElement("div",null,"Loading...")}}]),a}(s.a.Component);function ce(e){return e.obj.ImageID&&"MISSING"!==e.obj.ImageID?s.a.createElement("img",{src:"https://drive.google.com/thumbnail?id="+e.obj.ImageID,alt:e.alt}):s.a.createElement("div",{className:"imgPlaceholder"},s.a.createElement("div",null,e.alt))}function ue(e){var t=e.hideIcon||!1;return s.a.createElement("div",{className:"attrList"},e.attr.map((function(a){var n=(e.value?e.value[a]:0)+(e.bonus?e.bonus[a]:0),r=n;e.bonus&&(e.bonus.AddedStat||(r="+"+r));var i={attr:a,value:n,maxValue:e.maxValue};return e.baseline&&(i.baseline=e.baseline[a]),s.a.createElement("div",{className:"attr",key:a},!t&&s.a.createElement(de,{attr:a}),s.a.createElement("span",{className:"numberText"},r),s.a.createElement(me,i),e.baseline&&s.a.createElement("span",{className:"numberText"},"".concat(e.value[a]>e.baseline[a]?"+":"").concat(e.value[a]-e.baseline[a])))})))}function me(e){return s.a.createElement("span",{className:"statusBarContainer"},e.baseline&&s.a.createElement("span",{className:"baseline",style:{marginLeft:"".concat(e.baseline/e.maxValue*100,"%")}}),s.a.createElement("span",{className:"statusBar "+e.attr.toLowerCase(),style:{width:"".concat(e.value/e.maxValue*100,"%")}}))}function de(e){return s.a.createElement("span",{className:"icon "+e.attr.toLowerCase()},e.attr)}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(oe,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[24,1,2]]]);
//# sourceMappingURL=main.bdfdfdec.chunk.js.map