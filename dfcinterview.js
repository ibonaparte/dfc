"use strict";

/**
 * Load https://digitalfuelcapital.com/
 * Pretend this file is injected right after the <head> of the document
 * For dev, you can just paste this into the console ASAP after refreshing the page

 ### Section 1: Coding (1 hour) ###
 * Hypothesis: The loading and paralax scroll stuff is distracting and not needed
 * Write code at the bottom of this file to:
 * 1) Remove the orange loading gif from the page
 * 2) Remove as many Scroll / CSS transitions as possible
 * 3) Make all mouseover transitions immediate

 ### Section 2: Communication of Deliverables (1 hour) ###
 * Communicate to the "client" (TomFuertes@gmail.com), how to install this file on dfc.com
 * 1) Pretend the file needs to be installed. Send instructions to TomFuertes@gmail.com as
 *    to how you recommend installing this code in the <head> and how he can preview it
 * 2) Pretend the variation "won" and needs to be deployed. Send a second email on how to
 *    deploy the winner of the experiment live to 100% of the traffic (minimize acrrued
 *    technical debt)

 ### Notes ###
 const idx = window.dfc('exp1');
 if (idx === 0) {
    dfc.log('v0 is control, do nothing')
 } else if (idx === 1) {
    dfc.log('v1 is variation, edit the page here given requirements in Section 1')
 }
 */

(() => {
  const prefix = 'dfc-exp-';
  try {
    // check params for bucketing information
    const searchParams = new URLSearchParams(location.search);
    const force = new RegExp(`^${prefix}`);
    searchParams.forEach((value, key) => {
      if (force.test(key)) {
        localStorage.setItem(key, value);
      }
    });
  } catch (e) {
    // do nothing b/c old browsers don't support URLSearchParams
    // eslint-disable-next-line no-console
    console.error(e);
  }

  // bail if loaded already
  if (window.dfc) return;

  /* Exposes window.dfc
   * arg1: experiment id string from optimize
   * arg2: optional number of variations / default: 2
   */
  const dfc = window.dfc = function (expId) {
    let variations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    try {
      const key = `${prefix}${expId}`;
      const idx = parseInt(
      // find the variation by waterfall
      (() => {
        const storage = localStorage.getItem(key);

        // check localStorage
        if (storage) {
          return storage;
        } else {
          // fallback to random
          return ((min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
          })(0, variations - 1);
        }
      })(), 10);

      // persist the variation to storage
      localStorage.setItem(key, idx);

      // publish the decision
      experiments.push([expId, idx]);
      try {
        trackers.forEach(t => t(expId, idx));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }

      // return index (integer)
      return idx;
    } catch (e) {
      // fallback to control if error / usually a browser bug
      return 0;
    }
  };

  // subscribe to activations
  const experiments = dfc.experiments = [];
  // trackers should should expect args[0] str:id and args[1] int:idx
  const trackers = dfc.trackers = [];
  dfc.version = '2022-12';

  // waits for jQuery
  // dfc.jq($=>{dfc.log('jQuery loaded')})
  dfc.jq = callback => {
    const $ = window.jQuery;
    if ($ && $.fn && $.fn.jquery) callback($);else window.requestAnimationFrame(dfc.jq.bind(null, callback));
  };

  // polls for an element
  // dfc.raf('header', $header => jQuery($header).remove())
  dfc.raf = (selector, callback) => {
    const $els = document.querySelectorAll(selector);
    if ($els && !!$els.length) return callback($els);
    window.requestAnimationFrame(dfc.raf.bind(null, selector, callback));
  };

  // adds an inline string to the <head>
  // window.dfc.addStyle(`.foo { color: red; }`);
  dfc.addStyle = css => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
  };

  // eslint-disable-next-line no-console
  dfc.log = console.info.bind(console, '[dfc]');

  //Remove the orange splash and spinning loader
  document.getElementById('loader-wrapper').remove();

  //Add CSS to remove any class with animation or transition elements
  window.dfc.addStyle('.arrowbounce{ animation: none!important; }    .fadeInUp{animation-name: none!important;}   .roberto-btn{ transition: none!important; }   .navunderline{ transition: none!important; }    .classynav ul li a:hover{ color: unset!important; }    .room-content .carousel-btn{ padding-left: 0px!important;}   .rss-item a{ background-image: linear-gradient(90deg, #000 25%, black 75%); }');

  const learnMoreButtons = document.querySelectorAll('.carousel-btn');
  for (var i = 0; i< learnMoreButtons.length; i++) {
    learnMoreButtons[i].classList.remove('fixed-bottom');
  }

