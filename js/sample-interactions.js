/* Slide 6 enhancement. Native radios remain the single answer source of truth. */
(() => {
  'use strict';
  const target=document.querySelector('#packing-target');
  const grips=[...document.querySelectorAll('[data-pack]')];
  let drag=null,suppressClick=false;
  function pack(grip){
    const input=grip.closest('.pack-slot').querySelector('input');
    input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));input.focus({preventScroll:true});
  }
  function cleanup(){if(!drag)return;drag.slot.style.transform='';drag.slot.removeAttribute('data-dragging');target.removeAttribute('data-drop');drag=null;}
  grips.forEach(grip=>{
    grip.addEventListener('click',event=>{if(suppressClick&&event.detail!==0){suppressClick=false;event.preventDefault();return;}pack(grip);});
    grip.addEventListener('pointerdown',event=>{
      if(event.button!==undefined&&event.button!==0)return;
      drag={grip,slot:grip.closest('.pack-slot'),id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};suppressClick=false;
      grip.setPointerCapture(event.pointerId);
    });
    grip.addEventListener('pointermove',event=>{
      if(!drag||drag.id!==event.pointerId)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;drag.moved ||= Math.hypot(dx,dy)>8;
      if(!drag.moved)return;
      drag.slot.dataset.dragging='true';drag.slot.style.transform=`translate(${dx}px,${dy}px)`;
      const r=target.getBoundingClientRect(),inside=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
      target.dataset.drop=inside?'ready':'waiting';
    });
    grip.addEventListener('pointerup',event=>{
      if(!drag||drag.id!==event.pointerId)return;
      const moved=drag.moved,r=target.getBoundingClientRect();
      const inside=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
      cleanup();suppressClick=moved;if(moved&&inside)pack(grip);
    });
    grip.addEventListener('pointercancel',()=>{suppressClick=true;cleanup();});
    grip.addEventListener('lostpointercapture',()=>{if(drag){suppressClick=drag.moved;cleanup();}});
  });
  // Navigation and canceled gestures never commit an answer.
  window.addEventListener('pagehide',cleanup);
  window.TravelSample={cancelDrag:cleanup};
})();
