/* Tiny hand-drawn-ish SVG doodles. All 64x64. Colours come from CSS classes (see style.css, ".ico"). */
(function () {
  const S = (inner, vb) => '<svg class="ico" viewBox="' + (vb || '0 0 64 64') + '" aria-hidden="true" focusable="false">' + inner + '</svg>';
  const HEART = 'M32 54C12 40 7 25 16 16c6-6 13-3 16 4 3-7 10-10 16-4 9 9 4 24-16 38z';
  const SPARK = 'M32 6C34 22 42 30 58 32 42 34 34 42 32 58 30 42 22 34 6 32 22 30 30 22 32 6z';

  function petals(n, rx, ry, dist, cls, off) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + (off || 0);
      s += '<ellipse class="' + cls + '" cx="0" cy="' + (-dist) + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + a + ')"/>';
    }
    return s;
  }
  // flower heads centred on (0,0), roughly 30 units across
  const HEADS = {
    poppy: () => petals(5, 13, 13, 14, 'fr', 8) + '<circle class="fk" cx="0" cy="0" r="8"/><path d="M-4 -3h.1M3 -4h.1M4 3h.1M-3 4h.1" style="stroke:#f3d98b;stroke-width:2.6"/>',
    blush: () => petals(6, 9, 13, 14, 'fb', 0) + '<circle class="fy" cx="0" cy="0" r="7"/>',
    daisy: () => petals(10, 4.6, 11, 14, 'fw', 0) + '<circle class="fy" cx="0" cy="0" r="7.5"/>',
    tulip: () => '<path class="fr" d="M-17 -14Q-20 14 0 20Q20 14 17 -14L8 -3L0 -18L-8 -3Z"/><path d="M0 -18V16M-8 -3Q-9 8 -3 17M8 -3Q9 8 3 17" style="opacity:.55"/>',
    bud: () => petals(5, 7, 9, 10, 'fb', 20) + '<circle class="fr" cx="0" cy="0" r="4.5"/>',
    cream: () => petals(7, 8, 12, 13, 'fc', 0) + '<circle class="fk2" cx="0" cy="0" r="6"/>'
  };

  const ICONS = {
    heart: () => S('<path class="fr" d="' + HEART + '"/><path d="M19 23c1-3 4-5 7-4" style="stroke:#fffaf1;stroke-width:2.4"/>'),
    spark: () => S('<path class="fy" d="' + SPARK + '"/>'),
    bow: () => S('<path class="fr" d="M32 32C20 16 4 18 6 32c-2 14 14 16 26 0z"/><path class="fr" d="M32 32c12-16 28-14 26 0 2 14-14 16-26 0z"/><path class="fr" d="M30 34L22 56l8-4 4 6 2-20z"/><path class="fr" d="M34 34l8 22-8-4-4 6z"/><circle class="fr" cx="32" cy="32" r="5.5"/>'),
    flower: () => S('<g transform="translate(32 32)">' + HEADS.blush() + '</g>'),
    flower2: () => S('<g transform="translate(32 32) scale(1.05)">' + HEADS.daisy() + '</g>'),
    flower3: () => S('<g transform="translate(32 32)">' + HEADS.poppy() + '</g>'),
    tulip: () => S('<path d="M32 40V60" style="stroke:#7f8c5c;stroke-width:3"/><path class="fg" d="M32 54q-12-2-14-12 10 0 14 12z"/><g transform="translate(32 26) scale(.95)">' + HEADS.tulip() + '</g>'),
    teddy: () => S('<circle class="ft" cx="15" cy="17" r="8.5"/><circle class="ft" cx="49" cy="17" r="8.5"/><circle class="ns fb" cx="15" cy="17" r="4"/><circle class="ns fb" cx="49" cy="17" r="4"/><circle class="ft" cx="32" cy="33" r="20"/><ellipse class="fc" cx="32" cy="41" rx="9.5" ry="7.5"/><ellipse class="fk" cx="32" cy="38" rx="3" ry="2.2"/><path d="M32 40v3.5M27.5 45.5q4.5 3 9 0"/><circle class="ns fk" cx="24" cy="30" r="2"/><circle class="ns fk" cx="40" cy="30" r="2"/><circle class="ns fb" cx="20" cy="38" r="3.2"/><circle class="ns fb" cx="44" cy="38" r="3.2"/><path class="fr" d="M32 55l-10-5v10zM32 55l10-5v10z"/><circle class="fr" cx="32" cy="55" r="2.6"/>'),
    envelope: () => S('<rect class="fw" x="6" y="14" width="52" height="38" rx="4"/><path d="M6 18l26 20 26-20"/><path class="fr ns" transform="translate(25 33) scale(.22)" d="' + HEART + '"/>'),
    firecracker: () => S('<g transform="rotate(32 32 36)"><rect class="fr" x="24" y="22" width="16" height="32" rx="3"/><path d="M24 31h16M24 45h16"/><path d="M32 22q1-6 5-9"/></g><path class="fy" transform="translate(41 4) scale(.2)" d="' + SPARK + '"/><path d="M50 14l4-3M54 22l5-1M44 8l1-5"/>'),
    play: () => S('<rect class="fr" x="5" y="14" width="54" height="36" rx="11"/><path class="fw" d="M26 23l17 9-17 9z"/>'),
    coffee: () => S('<path d="M19 4q-4 4 0 8t0 6M29 4q-4 4 0 8t0 6"/><path class="fc" d="M9 24h34v14a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14z"/><path d="M43 28h4a6 6 0 0 1 0 12h-4"/><path class="ns fk" d="M11 27h30v3H11z"/><ellipse class="fb" cx="26" cy="57" rx="21" ry="4"/>'),
    icecream: () => S('<path class="fo2" d="M20 33h24L32 60z"/><path d="M24 40l12 14M36 36l-10 12M29 36l9 11"/><circle class="fb" cx="32" cy="26" r="13"/><circle class="fc" cx="32" cy="13" r="9"/><circle class="fr" cx="33" cy="4" r="3"/>'),
    rooftop: () => S('<path class="fy" transform="translate(6 3) scale(.2)" d="' + SPARK + '"/><path class="fy" transform="translate(30 2) scale(.15)" d="' + SPARK + '"/><rect class="fk2" x="38" y="10" width="14" height="12" rx="2"/><path d="M41 22v5M49 22v5"/><path class="fc" d="M6 27h5v-4h6v4h6v-4h6v4h6v-4h6v4h6v-4h6v4h5v29H6z"/><rect class="fb" x="13" y="36" width="9" height="11"/><rect class="fb" x="27" y="36" width="9" height="11"/><rect class="fk2" x="43" y="40" width="9" height="16"/><g transform="translate(9 3) rotate(25 9 14)"><rect class="fr" x="5" y="7" width="8" height="13" rx="2"/></g>'),
    bench: () => S('<circle class="fk" cx="20" cy="8" r="1.7"/><circle class="fk" cx="27" cy="8" r="1.7"/><circle class="fk" cx="34" cy="8" r="1.7"/><rect class="ft" x="8" y="20" width="48" height="7" rx="2"/><rect class="ft" x="6" y="36" width="52" height="8" rx="2"/><path d="M14 27v9M50 27v9M12 44v14M52 44v14"/>'),
    bucket: () => S('<path class="fc" d="M26 26V8h12v18"/><path class="fr" d="M26 13h12v6H26z"/><path d="M12 28C13 6 51 6 52 28" style="opacity:0"/><path class="fb" d="M10 28h44l-5 30H15z"/><ellipse class="fc" cx="32" cy="28" rx="22" ry="5"/><path d="M26 26V12M38 26V12" style="opacity:0"/><path d="M12 32q20 6 40 0" style="opacity:.4"/>'),
    laugh: () => S('<circle class="fy" cx="32" cy="32" r="23"/><path d="M19 25l8 3.5-8 3.5M45 25l-8 3.5 8 3.5"/><path class="fk" d="M17 38q15 20 30 0z"/><path class="fb" d="M10 22q-4 6 0 9 4-3 0-9M54 22q4 6 0 9-4-3 0-9"/>'),
    plate: () => S('<circle class="fc" cx="36" cy="33" r="19"/><circle cx="36" cy="33" r="11"/><path d="M6 9v12q0 4 3.5 4T13 21V9M9.5 25v31"/><ellipse class="fc" cx="59" cy="16" rx="3.5" ry="6"/><path d="M59 22v34"/>'),
    smirk: () => S('<circle class="fy" cx="32" cy="32" r="23"/><path d="M17 22l11 3.5M37 25.5q5-3 9-1"/><circle class="fk ns" cx="25" cy="31" r="2"/><circle class="fk ns" cx="40" cy="31" r="2"/><path d="M21 42q11 8 22-2"/><circle class="fb ns" cx="19" cy="38" r="3"/>'),
    coin: () => S('<circle class="fy" cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="17"/><path class="fr" d="M32 43c-10-6-12-12-8-16 3-3 6-1 8 2 2-3 5-5 8-2 4 4 2 10-8 16z"/>'),
    dancer: () => S('<circle class="fc" cx="32" cy="14" r="8.5"/><circle class="fb ns" cx="27" cy="16" r="2"/><circle class="fb ns" cx="37" cy="16" r="2"/><path d="M28 12q2-2 4 0"/><path class="fr" d="M32 24l-13 22h26z"/><path d="M25 29L13 15M39 29l12-14"/><path d="M27 46l-3 13M37 46l9 8"/><path d="M53 31l5-2M54 40l5 2M10 28l-4-2"/>'),
    bust: () => S('<circle class="fc" cx="32" cy="22" r="12"/><path class="fb" d="M9 58c0-15 10-21 23-21s23 6 23 21z"/><path class="fr ns" transform="translate(25 44) scale(.22)" d="' + HEART + '"/><path d="M26 22h.1M38 22h.1M28 27q4 3 8 0"/>'),
    bubble: () => S('<path class="fb" d="M9 12h46a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H30L17 54V42H9a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z"/><path class="fr" d="M32 36c-8-5-10-9-6-13 2-2 5-1 6 1 1-2 4-3 6-1 4 4 2 8-6 13z"/>'),
    cross: () => S('<path d="M32 3v6M11 11l4 4M53 11l-4 4M5 31h6M53 31h6"/><path class="fy" d="M28 12h8v14h14v8H36v24h-8V34H14v-8h14z"/>'),
    scooter: () => S('<circle class="fc" cx="14" cy="48" r="8"/><circle class="fc" cx="50" cy="48" r="8"/><circle cx="14" cy="48" r="2.5"/><circle cx="50" cy="48" r="2.5"/><path class="fr" d="M8 40c0-9 7-13 16-13h7c3 0 5 2 5 5v10H17z"/><path class="fr" d="M36 42h12L45 22l-6 3z"/><path d="M42 20h12"/><path class="fk ns" d="M12 29h16v-5H14z" style="opacity:0"/><path d="M2 36l5-1M1 43l5-1"/>'),
    hands: () => S('<path class="fr" transform="translate(-4 3) rotate(-14 32 32) scale(.82)" d="' + HEART + '"/><path class="fb" transform="translate(12 -1) rotate(14 32 32) scale(.78)" d="' + HEART + '"/>'),
    cap: () => S('<path class="fk" d="M32 12L5 25l27 13 27-13z"/><path class="fk" d="M16 33v12c9 8 23 8 32 0V33L32 40z"/><path d="M55 27v17"/><circle class="fr" cx="55" cy="47" r="3"/>'),
    scent: () => S('<path d="M22 4q-5 5 0 10t0 10M32 2q-5 5 0 10t0 10"/><g transform="translate(32 44) scale(.8)">' + HEADS.daisy() + '</g>'),
    haha: () => S('<path class="fb" d="M5 8h30a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H19l-8 8v-8H5a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z"/><path class="fy" d="M27 31h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-4v8l-8-8H27a4 4 0 0 1-4-4V35a4 4 0 0 1 4-4z"/><text x="20" y="25" text-anchor="middle" class="tx">ha</text><text x="41" y="48" text-anchor="middle" class="tx">haha</text>'),
    house: () => S('<path class="fc" d="M11 31L32 13l21 18v25H11z"/><path class="fr" d="M5 33L32 9l27 24"/><rect class="fb" x="26" y="40" width="12" height="16"/><path class="fr ns" transform="translate(40 30) scale(.16)" d="' + HEART + '"/>'),
    arms: () => S('<path class="fr" transform="translate(12.5 12) scale(.6)" d="' + HEART + '"/><path d="M9 20c-5 15 3 31 23 34M55 20c5 15-3 31-23 34"/><circle class="fc" cx="9" cy="19" r="4"/><circle class="fc" cx="55" cy="19" r="4"/>'),
    calendar: () => S('<rect class="fw" x="7" y="12" width="50" height="44" rx="5"/><path class="fr" d="M7 17a5 5 0 0 1 5-5h40a5 5 0 0 1 5 5v8H7z"/><path d="M20 7v9M44 7v9"/><path class="fr" transform="translate(20 28) scale(.38)" d="' + HEART + '"/>'),
    cake: () => S('<path class="fo" d="M32 3c4 5 4 9 0 11-4-2-4-6 0-11z"/><rect class="fy" x="29" y="14" width="6" height="14"/><rect class="fb" x="9" y="30" width="46" height="26" rx="4"/><path class="fw" d="M9 38q6 7 12 0t12 0 11 0 11 0v-4a4 4 0 0 0-4-4H13a4 4 0 0 0-4 4z"/>'),
    plane: () => S('<path class="fc" d="M5 31L59 8 45 56 32 40z"/><path d="M59 8L32 40l-3 14-3-17"/>'),
    road: () => S('<path d="M5 52C20 56 22 38 34 36s10-14 18-22" stroke-dasharray="1 6"/><path class="fy" transform="translate(40 2) scale(.34)" d="' + SPARK + '"/><circle class="fr" cx="9" cy="52" r="4"/>'),
    twoppl: () => S('<circle class="fc" cx="21" cy="24" r="9"/><circle class="fc" cx="43" cy="24" r="9"/><path class="fb" d="M5 58c0-13 7-19 16-19s16 6 16 19z"/><path class="fr" d="M27 58c0-13 7-19 16-19s16 6 16 19z"/><path class="fr" transform="translate(26 3) scale(.2)" d="' + HEART + '"/><circle cx="18" cy="24" r="3.4"/><circle cx="25.5" cy="24" r="3.4"/><path d="M21.4 24h.7"/>'),
    basketball: () => S('<circle class="fo" cx="32" cy="32" r="23"/><path d="M32 9v46M9 32h46M16 15c10 8 10 26 0 34M48 15c-10 8-10 26 0 34"/>'),
    headphones: () => S('<path d="M11 38V32a21 21 0 0 1 42 0v6"/><rect class="fr" x="6" y="35" width="12" height="19" rx="5"/><rect class="fr" x="46" y="35" width="12" height="19" rx="5"/><path d="M29 47V35l9-2v11"/><circle class="fk" cx="26.5" cy="47.5" r="3"/><circle class="fk" cx="35.5" cy="45" r="3"/>'),
    star: () => S('<path class="fy" d="' + SPARK + '"/>')
  };

  window.ICONS = ICONS;
  window.HEADS = HEADS;
})();
