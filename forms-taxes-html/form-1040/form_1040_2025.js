(function(){
  const q = s => document.querySelector('[name="'+s+'"]');
  const val = s => {
    const e=q(s); const n=e ? parseFloat(e.value) : 0;
    return Number.isFinite(n) ? n : 0;
  };
  const set = (s,n) => { const e=q(s); if(e) e.value=(Math.max(0,n)||0).toFixed(2); };

  const moneyInputs = [...document.querySelectorAll('input[type=number]:not([readonly])')];
  moneyInputs.forEach(e=>e.addEventListener('input', calculate));

  function calculate(){
    const z = ['1a','1b','1c','1d','1e','1f','1g','1h'].reduce((a,k)=>a+val(k),0);
    set('1z',z);
    set('9', z+val('2b')+val('3b')+val('4b')+val('5b')+val('6b')+val('7a')+val('8'));
    set('11a', Math.max(0,val('9')-val('10')));
    if(q('11b')) q('11b').value=q('11a').value;
    set('14',val('12e')+val('13a')+val('13b'));
    set('15',Math.max(0,val('11b')-val('14')));
    set('18',val('16')+val('17'));
    set('21',val('19')+val('20'));
    set('22',Math.max(0,val('18')-val('21')));
    set('24',val('22')+val('23'));
    set('25d',val('25a')+val('25b')+val('25c'));
    set('32',val('27a')+val('28')+val('29')+val('30')+val('31'));
    set('33',val('25d')+val('26')+val('32'));
    set('34',Math.max(0,val('33')-val('24')));
    set('37',Math.max(0,val('24')-val('33')));
  }
  calculate();
})();