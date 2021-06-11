/*
 * xs-school-mainpage.js
 *
 * Libraries in use:
 *
 * async-script-loader:
 *  https://github.com/CSharperMantle/async-script-loader
 *  MIT License. Copyright (c) Rong "Mantle" Bao (aka CSharperMantle)
 * Click-switch Images:
 *  https://codepen.io/CSharperMantle/pen/yLOrJQQ
 *  MIT License. Copyright (c) Rong "Mantle" Bao (aka CSharperMantle)
 * Really simple non-jQuery slider:
 *  https://codepen.io/CSharperMantle/pen/OJXLzVV
 *  MIT License. Copyright (c) Rong "Mantle" Bao (aka CSharperMantle) and Ben Wellby
 * Animated D2303 Class Flag:
 *  https://codepen.io/CSharperMantle/pen/MWeLxWY
 *  MIT License. Copyright (c) Rong "Mantle" Bao (aka CSharperMantle)
 * canvas-confetti:
 *  https://github.com/catdad/canvas-confetti
 *  ISC License. Copyright (c) 2020, Kiril Vatev
 * lodash:
 *  https://github.com/lodash/lodash/
 *  MIT License. Copyright JS Foundation and other contributors <https://js.foundation/>
 * gsap:
 *  https://greensock.com
 *  OTHER. Copyright 2020, GreenSock. All rights reserved. Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * ChemDoodle Web Component:
 *  https://web.chemdoodle.com
 *  GPLv3 License. Copyright (c) 2007-2021 iChemLabs, LLC.
 */

;(function () {
  const AsyncScriptLoader = {
    loadScript: function (
      url,
      baseElem,
      resolveWhen,
      isWithIntegrity,
      integrity,
      crossorigin
    ) {
      return new Promise(function (resolve, reject) {
        const scriptElem = document.createElement('script')
        scriptElem.setAttribute('src', url)
        if (isWithIntegrity) {
          scriptElem.setAttribute('integrity', integrity)
          scriptElem.setAttribute('crossorigin', crossorigin)
        }
        scriptElem.addEventListener('load', function () {
          while (!resolveWhen());
          resolve()
        })
        scriptElem.addEventListener('error', function () {
          reject(new Error(`AsyncScriptLoader: ${url} fails to load`))
        })
        baseElem.insertAdjacentElement('afterbegin', scriptElem)
      })
    }
  }
  window.AsyncScriptLoader = AsyncScriptLoader
})()
;(function () {
  // HACK: bypass script tag filtering, inserting tags for script, one linked by one, with promise chains
  const body = document.getElementsByTagName('body')[0]

  AsyncScriptLoader.loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js',
    body,
    () => {
      return typeof _ === 'function'
    },
    true,
    'sha512-90vH1Z83AJY9DmlWa8WkjkV79yfS2n2Oxhsi2dZbIv0nC4E6m5AbH8Nh156kkM7JePmqD6tcZsfad1ueoaovww==',
    'anonymous'
  )
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://csharpermantle.github.io/xs-d2303-homepage/assets/js/non-jquery-sliders.js',
        body,
        () => {
          return true
        },
        false,
        null,
        null
      )
    })
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js',
        body,
        () => {
          return typeof gsap !== 'undefined'
        },
        true,
        'sha512-IQLehpLoVS4fNzl7IfH8Iowfm5+RiMGtHykgZJl9AWMgqx0AmJ6cRWcB+GaGVtIsnC4voMfm8f2vwtY+6oPjpQ==',
        'anonymous'
      )
    })
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://csharpermantle.github.io/xs-d2303-homepage/assets/js/CustomEase-3.5.1.min.js',
        body,
        () => {
          return typeof CustomEase !== 'undefined'
        },
        false,
        null,
        null
      )
    })
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://csharpermantle.github.io/xs-d2303-homepage/assets/js/CustomWiggle-3.4.3.min.js',
        body,
        () => {
          return typeof CustomWiggle !== 'undefined'
        },
        false,
        null,
        null
      )
    })
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js',
        body,
        () => {
          return typeof confetti === 'function'
        },
        false,
        null,
        null
      )
    })
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://csharpermantle.github.io/xs-d2303-homepage/assets/js/ChemDoodleWeb.js',
        body,
        () => {
          return typeof ChemDoodle !== 'undefined'
        },
        false,
        null,
        null
      )
    })
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://csharpermantle.github.io/xs-d2303-homepage/assets/chemdoodle-uis/ChemDoodleWeb-uis.js',
        body,
        () => {
          return true
        },
        false,
        null,
        null
      )
    })
    .then(() => {
      initializeComponents()
    })
    .catch((reason) => {
      console.log(reason)
    })
})()

const ELEMID_BUTTON_AIRPLANE = 'button-airplane'
const ELEMID_BUTTON_RANDNUM_GENERATE = 'button-randnum-generate'
const ELEMID_BUTTON_WELCOME_PRIDE = 'button-welcome-pride'
const ELEMID_BUTTON_ATOM_VIEWER = 'button-atom-viewer'
const ELEMID_BUTTON_REFRESH_FORTUNE = 'button-refresh-fortune'
const ELEMID_CONFETTI_OVERLAY = 'canvas-confetti-overlay'
const ELEMID_DIV_ATOM_VIEWER_WRAPPER = 'div-atom-viewer-wrapper'
const ELEMID_DIV_HIDDEN_PANEL = 'div-hidden-panel'
const ELEMID_DIV_RANDNUM_RESULT = 'div-randnum-result'
const ELEMID_DIV_RAINBOW_LOADER = 'div-rainbow-loader'
const ELEMID_FIGURE_UNDER_CONSTRUCTION = 'figure-under-construction'
const ELEMID_INPUT_RANDNUM_END_NUM = 'input-randnum-end-num'
const ELEMID_INPUT_RANDNUM_START_NUM = 'input-randnum-start-num'
const ELEMID_PRE_USER_AGENT = 'pre-user-agent'
const ELEMID_SCRIPT_ASTEROID = 'script-asteroid'
const ELEMID_SPAN_RANDOM_QUOTE = 'span-random-quote'
const SRC_SCRIPT_ASTEROID =
  'https://csharpermantle.github.io/xs-d2303-homepage/assets/js/asteroids.js'
const SRC_TXT_FORTUNE =
  'https://csharpermantle.github.io/xs-d2303-homepage/assets/txt/fortunes.txt'
let isHiddenPanelShowing = false
let isAtomViewerShowing = false
let prideInterval = null

// click-switching images
function loadSwitchableImg() {
  'use strict'
  function refreshSwitch(s) {
    const currentSwitch = s.dataset.switchCurrent

    const switchAttrStr = 'switchSrc-' + currentSwitch
    const currentSwitchSrc = s.dataset[switchAttrStr]

    s.setAttribute('src', currentSwitchSrc)
  }

  function switchNext(s) {
    let currentSwitch = parseInt(s.dataset.switchCurrent, 10)
    const switchCases = parseInt(s.dataset.switchCases, 10)

    currentSwitch += 1
    if (currentSwitch >= switchCases) {
      currentSwitch = 0
    }

    s.dataset.switchCurrent = currentSwitch
  }

  function initializeSwitch() {
    const switchables = document.getElementsByClassName('switchable')
    for (let i = 0; i < switchables.length; i += 1) {
      const switchable = switchables[i]
      refreshSwitch(switchable)
      switchable.addEventListener('click', () => {
        switchNext(switchable)
        refreshSwitch(switchable)
      })
    }
  }
  initializeSwitch()
}

// gsap animation
function loadDropper() {
  // confetti helpers
  const confettiCount = 200
  const confettiDefaults = {
    origin: { y: 0.7 }
  }

  function fireConfetti(instance, particleRatio, opts) {
    instance(
      Object.assign({}, confettiDefaults, opts, {
        particleCount: _.floor(confettiCount * particleRatio)
      })
    )
  }

  // gsap helpers
  const select = (s) => document.querySelector(s)
  const mainSVG = select('.mainSVG')
  const liquid = select('#liquid')
  const flask = select('#flask')
  const confettiCanvas = select('#canvas-dropper-confetti')
  const pointArray = []
  const pointValueXArray = []
  const pointValueYArray = []
  const liquidWidth = 200
  const numPoints = 20
  const dripOffset = 0.0258
  const rippleAmount = '+=6'
  let startValX = 63
  const startValY = 115
  const colorArray = [
    '#E6098B',
    '#FFBE0B',
    '#FB5607',
    '#8338EC',
    '#3A86FF',
    '#51E5FF',
    '#04A777',
    '#F75C03',
    '#F71735'
  ]

  gsap.set(mainSVG, {
    visibility: 'visible'
  })
  for (let i = 0; i < numPoints; i++) {
    const p = liquid.points.appendItem(mainSVG.createSVGPoint())
    pointArray.push(p)
    pointValueXArray.push(
      i < numPoints - 2 ? startValX : i === numPoints - 2 ? 600 : 200
    )
    startValX += liquidWidth / (numPoints - 2)
    pointValueYArray.push(i < numPoints - 2 ? startValY : 800)
  }

  gsap.set(pointArray, {
    x: gsap.utils.wrap(pointValueXArray),
    y: gsap.utils.wrap(pointValueYArray)
  })

  gsap.set('#level', {
    transformOrigin: '50% 100%'
  })

  const makeDrip = () => {
    const currentColor = gsap.utils.random(colorArray)
    gsap.to(':root', {
      '--main-color': currentColor
    })

    const tl = gsap.timeline({
      defaults: {
        ease: CustomWiggle.create('', {
          type: 'easeOut',
          wiggles: gsap.utils.random(9, 12)
        })
      }
    })

    tl.fromTo(
      '#pipette1',
      {
        x: 250,
        opacity: 0
      },
      {
        duration: 1,
        x: 160,
        opacity: 1,
        ease: 'expo.inOut'
      }
    )
      .fromTo(
        '#pipette1',
        {
          rotation: -95,
          transformOrigin: '50% 100%'
        },
        {
          rotation: 0,
          transformOrigin: '50% 100%',
          duration: 1.5,
          ease: 'elastic(1.5, 0.83)'
        },
        0
      )
      .addLabel('pipetteReady')
      .fromTo(
        '#drip',
        {
          scale: 0
        },
        {
          duration: 1,
          scale: 0.3,
          transformOrigin: '50% 0%',
          ease: 'elastic(1, 0.8)'
        }
      )
      .to(
        '#level',
        {
          duration: 1,
          scaleY: 0.2,
          ease: 'elastic(1, 0.8)'
        },
        'pipetteReady'
      )
      .fromTo(
        '#drip',
        {
          x: 165.5,
          y: 21
        },
        {
          x: 165.5,
          y: 125,
          duration: 0.35,
          ease: 'power1.in'
        }
      )
      .addLabel('splash')
      .to(
        '.poly',
        {
          fill: currentColor,
          ease: 'sine'
        },
        'splash'
      )
      .to(
        pointArray,
        {
          duration: gsap.utils.random(3, 5),
          y: (i) => {
            return rippleAmount
          },
          stagger: {
            each: dripOffset,
            from: 'center'
          }
        },
        'splash'
      )
      .to(
        '#droplet',
        {
          duration: 0.23,
          y: 'random(-30, -60, 1)',
          rotation: 'random(20, 290)',
          ease: 'power1'
        },
        'splash'
      )
      .to(
        '#droplet',
        {
          duration: 0.23,
          y: 0,
          rotation: '+=30',
          ease: 'power1.in'
        },
        'splash+=0.23'
      )
      .fromTo(
        '#droplet',
        {
          scale: 1
        },
        {
          duration: 0.23,
          scale: 0,
          transformOrigin: '50% 100%',
          ease: 'expo.in'
        },
        'splash+=0.23'
      )
      .to(
        '#level',
        {
          duration: 1,
          scaleY: 1,
          ease: 'expo.in'
        },
        'splash'
      )
      .to(
        '#pipette1',
        {
          duration: 1,
          rotation: 23,
          x: 100,
          opacity: 0,
          ease: 'expo.in'
        },
        'splash'
      )

    gsap.delayedCall(4, makeDrip)
  }

  makeDrip()

  // confetti
  const confettiInstance = confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true
  })

  const createFlaskConfettiEffect = _.throttle(() => {
    fireConfetti(confettiInstance, 0.25, {
      spread: 26,
      startVelocity: 30
    })
    fireConfetti(confettiInstance, 0.2, {
      spread: 60,
      startVelocity: 35
    })
    fireConfetti(confettiInstance, 0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      startVelocity: 40
    })
    fireConfetti(confettiInstance, 0.1, {
      spread: 120,
      startVelocity: 15,
      decay: 0.92,
      scalar: 1.2
    })
    fireConfetti(confettiInstance, 0.1, {
      spread: 120,
      startVelocity: 40
    })
  }, 500)

  flask.addEventListener('click', () => {
    createFlaskConfettiEffect()
  })
}

function loadHiddenPanel() {
  'use strict'

  document.getElementById(ELEMID_PRE_USER_AGENT).innerText = navigator.userAgent
  document
    .getElementById(ELEMID_FIGURE_UNDER_CONSTRUCTION)
    .addEventListener('click', () => {
      const hiddenPanelElem = document.getElementById(ELEMID_DIV_HIDDEN_PANEL)
      if (isHiddenPanelShowing) {
        // hide
        hiddenPanelElem.style.display = 'none'
        isHiddenPanelShowing = false
      } else {
        // show
        hiddenPanelElem.style.display = 'grid'
        isHiddenPanelShowing = true
      }
    })
  document
    .getElementById(ELEMID_BUTTON_AIRPLANE)
    .addEventListener('click', () => {
      let asteroidScript = document.getElementById(ELEMID_SCRIPT_ASTEROID)
      if (asteroidScript !== null) {
        document.body.removeChild(asteroidScript)
      } else {
        asteroidScript = document.createElement('script')
        asteroidScript.type = 'text/javascript'
        asteroidScript.setAttribute('id', ELEMID_SCRIPT_ASTEROID)
        asteroidScript.src = SRC_SCRIPT_ASTEROID
        document.body.appendChild(asteroidScript)
      }
    })

  document
    .getElementById(ELEMID_BUTTON_WELCOME_PRIDE)
    .addEventListener('click', switchConfettiPride)
}

function loadFortune() {
  const fortuneXhr = new XMLHttpRequest()
  fortuneXhr.onload = () => {
    // fortune quotes are splitted with '\n%\n'
    // Bug fixed: now handling percentage marks correctly
    const responseList = fortuneXhr.responseText.split('\n%\n')
    const randQuote = responseList[_.random(0, responseList.length - 1)].trim()
    document.getElementById(ELEMID_SPAN_RANDOM_QUOTE).innerText = randQuote
  }
  fortuneXhr.open('GET', SRC_TXT_FORTUNE)
  fortuneXhr.send()
}

function loadUtilities() {
  // random number generator
  document
    .getElementById(ELEMID_BUTTON_RANDNUM_GENERATE)
    .addEventListener('click', () => {
      const startNum = document.getElementById(
        ELEMID_INPUT_RANDNUM_START_NUM
      ).value
      const endNum = document.getElementById(ELEMID_INPUT_RANDNUM_END_NUM).value
      document.getElementById(ELEMID_DIV_RANDNUM_RESULT).innerText = _.random(
        startNum,
        endNum,
        false
      )
    })

  document
    .getElementById(ELEMID_BUTTON_ATOM_VIEWER)
    .addEventListener('click', () => {
      const atomViewerWrapper = document.getElementById(
        ELEMID_DIV_ATOM_VIEWER_WRAPPER
      )
      if (isAtomViewerShowing === false) {
        atomViewerWrapper.style.display = 'flex'
        isAtomViewerShowing = true
      } else {
        atomViewerWrapper.style.display = 'none'
        isAtomViewerShowing = false
      }
    })

  const chemDoodleCanvas = new ChemDoodle.SketcherCanvas(
    'canvas-chemdoodle',
    600,
    400,
    { useServices: true, oneMolecule: false }
  )
  chemDoodleCanvas.styles.atoms_displayTerminalCarbonLabels_2D = true
  chemDoodleCanvas.styles.atoms_useJMOLColors = true
  chemDoodleCanvas.styles.bonds_clearOverlaps_2D = true
  chemDoodleCanvas.styles.shapes_color = '#c10000'
  chemDoodleCanvas.repaint()

  document
    .getElementById(ELEMID_BUTTON_REFRESH_FORTUNE)
    .addEventListener('click', () => {
      loadFortune()
    })
}

function switchConfettiPride() {
  const canvas = document.getElementById(ELEMID_CONFETTI_OVERLAY)
  canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true })

  const colors = ['#bb0000', '#ffffff']
  if (!_.isNull(prideInterval)) {
    clearInterval(prideInterval)
    prideInterval = null
  } else {
    prideInterval = setInterval(() => {
      canvas.confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      canvas.confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })
    }, 10)
  }
}

function initializeComponents() {
  loadDropper()
  loadSwitchableImg()
  loadHiddenPanel()
  loadFortune()
  loadUtilities()

  /*
  const now = new Date()
  if (
    now.getFullYear() === 2021 &&
    now.getMonth() === 2 &&
    now.getDate() === 8
  ) {
    switchConfettiPride()
  } */
  // Hide the loader because we have finished loading
  document.getElementById(ELEMID_DIV_RAINBOW_LOADER).style.visibility =
    'collapse'
}
