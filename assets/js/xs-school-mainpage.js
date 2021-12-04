/*
 * xs-school-mainpage.js
 *
 * Libraries in use:
 *
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
 */

;(() => {
  const ELEMID_BUTTON_RANDNUM_GENERATE = 'button-randnum-generate'
  const ELEMID_BUTTON_WELCOME_PRIDE = 'button-welcome-pride'
  const ELEMID_CONFETTI_OVERLAY = 'canvas-confetti-overlay'
  const ELEMID_DIV_HIDDEN_PANEL = 'div-hidden-panel'
  const ELEMID_DIV_RANDNUM_RESULT = 'div-randnum-result'
  const ELEMID_DIV_RAINBOW_LOADER = 'div-rainbow-loader'
  const ELEMID_FIGURE_UNDER_CONSTRUCTION = 'figure-under-construction'
  const ELEMID_INPUT_RANDNUM_END_NUM = 'input-randnum-end-num'
  const ELEMID_INPUT_RANDNUM_START_NUM = 'input-randnum-start-num'
  let isHiddenPanelShowing = false
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
      .getElementById(ELEMID_BUTTON_WELCOME_PRIDE)
      .addEventListener('click', switchConfettiPride)
  }

  function loadUtilities() {
    // random number generator
    document
      .getElementById(ELEMID_BUTTON_RANDNUM_GENERATE)
      .addEventListener('click', () => {
        const startNum = document.getElementById(
          ELEMID_INPUT_RANDNUM_START_NUM
        ).value
        const endNum = document.getElementById(
          ELEMID_INPUT_RANDNUM_END_NUM
        ).value
        document.getElementById(ELEMID_DIV_RANDNUM_RESULT).innerText = _.random(
          startNum,
          endNum,
          false
        )
      })
  }

  function switchConfettiPride() {
    const canvas = document.getElementById(ELEMID_CONFETTI_OVERLAY)
    canvas.confetti =
      canvas.confetti || confetti.create(canvas, { resize: true })

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

  ;(() => {
    initializeComponents()
  })()
})()
