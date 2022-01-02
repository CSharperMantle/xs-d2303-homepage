/**
 * Copyright (c) 2021 by Rong "Mantle" Bao (https://codepen.io/CSharperMantle/pen/OJXLzVV)

 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

(function() {
  // ==GLOBAL VARS, CONSTS AND HELPERS==

  // create pager list items
  const sliderImagesList = document.querySelectorAll('.slider__images-image')
  const sliderPagersElem = document.querySelector('.js__slider__pagers') // we will only fill the first pager element

  // HACK: fill in sliders in advance in order to get the total count of elements in LAST_ELEM_INDEX
  function sliderPagePrefill() {
    sliderImagesList.forEach((image, index) => {
      const buttonElem = document.createElement('button')
      const buttonText = document.createTextNode(index + 1)
      buttonElem.appendChild(buttonText)
      buttonElem.setAttribute('type', 'button')
      sliderPagersElem.insertAdjacentElement('beforeend', buttonElem)

      // HACK: Chrome won't fire onload event for more than 1 time even the image's src has changed. This is to forcedly rerun the event handler each time the image is loaded. Chrome's behaviour is non-standard and described at http://code.google.com/p/chromium/issues/detail?id=7731#c12
      const imageLoader = new Image()
      imageLoader.addEventListener('load', () => {
        checkImageHeight()
        document.querySelector(SELECTOR_SLIDER_IMAGES).classList.add('loaded')
      })
      imageLoader.src = image.getAttribute('src')
    })
  }
  sliderPagePrefill()

  // set up constants and vars
  const SELECTOR_SLIDER_PAGERS = 'ol.js__slider__pagers button'
  const SELECTOR_SLIDER_PAGERS_ACTIVE = '.js__slider__pagers button.active'
  const SELECTOR_SLIDER_IMAGES = '.js__slider__images'
  const SELECTOR_SLIDER_IMAGES_ITEM = '.slider__images-item'
  const SELECTOR_SLIDER_CONTROL_NEXT = '.slider__control--next'
  const SELECTOR_SLIDER_CONTROL_PREV = '.slider__control--prev'

  // NOTE: You may be interested in tweaking switching speed by changing this constant.
  const SLIDER_SPEED = 5000

  const LAST_ELEM_INDEX =
      document.querySelectorAll(SELECTOR_SLIDER_PAGERS).length - 1

  let sliderTarget = null
  let animationOngoing = false // HACK: Prevent from interrupting animations
  let isDocumentOnFocus = true // HACK: Prevent the blurring from interrupting the animation

  function getFirstVisibleElem(iterable) {
    for (let i = 0; i < iterable.length; i++) {
      const elem = iterable[i]
      if (elem.style.display !== 'none' && elem.style.visibility !== 'hidden') {
        return elem
      }
    }
  }

  function indexOf(iterable, elem) {
    for (let i = 0; i < iterable.length; i++) {
      if (iterable[i] === elem) {
        return i
      }
    }
    return -1
  }

  function fadeInOut(elemFadeIn, elemFadeOut, speed) {
    animationOngoing = true
    const speed_ = speed || 20
    let currentInOpac = 0
    elemFadeIn.style.opacity = currentInOpac
    elemFadeOut.style.opacity = 1 - currentInOpac
    elemFadeIn.style.display = null
    elemFadeOut.style.display = null

    const interval = setInterval(() => {
      elemFadeIn.style.opacity = currentInOpac
      elemFadeOut.style.opacity = 1 - currentInOpac
      currentInOpac += 0.03
      if (currentInOpac >= 1) {
        elemFadeIn.style.opacity = null
        elemFadeOut.style.opacity = null
        elemFadeOut.style.display = 'none'
        clearInterval(interval)
        animationOngoing = false
      }
    }, speed_)
  }

  function initBlurDetection() {
    document.addEventListener('blur', () => {
      isDocumentOnFocus = false
    })
    document.addEventListener('focus', () => {
      isDocumentOnFocus = true
    })
  }
  initBlurDetection()

  // transition function
  function sliderResponse(sliderTarget) {
    const items = document.getElementsByClassName('slider__images-item')
    fadeInOut(items[sliderTarget], getFirstVisibleElem(items), 5)
    const pagers = document.querySelectorAll(SELECTOR_SLIDER_PAGERS)
    pagers.forEach((elem) => {
      elem.classList.remove('active')
    })
    pagers[sliderTarget].classList.add('active')
  }

  // add css height to slider images list
  function checkImageHeight() {
    const sliderHeight = getFirstVisibleElem(
      document.querySelectorAll('.slider__images-image')
    ).height
    document.querySelector(SELECTOR_SLIDER_IMAGES).style.height =
        sliderHeight + 'px'
  }

  // slider timing
  function sliderTiming() {
    if (!isDocumentOnFocus) {
      return
    }
    const currentActiveElem = document.querySelector(
      SELECTOR_SLIDER_PAGERS_ACTIVE
    )
    const currentActiveIndex = indexOf(
      currentActiveElem.parentElement.children,
      currentActiveElem
    )
    sliderTarget = currentActiveIndex
    sliderTarget = sliderTarget === LAST_ELEM_INDEX ? 0 : sliderTarget + 1
    sliderResponse(sliderTarget)
  }

  // ==SETUP FUNCTIONS==

  function initSliderPage() {
    window.onresize = () => {
      checkImageHeight()
    }
  }
  initSliderPage()

  // set up first slide
  function initFirstSlide() {
    document.querySelectorAll(SELECTOR_SLIDER_PAGERS)[0].classList.add('active')
    const slideImageItems = document.querySelectorAll(
      SELECTOR_SLIDER_IMAGES_ITEM
    )
    slideImageItems.forEach((elem) => {
      elem.style.display = 'none'
    })
    slideImageItems[0].style.display = null
  }
  initFirstSlide()

  // pager controls
  function initPageControl() {
    document
      .querySelectorAll(SELECTOR_SLIDER_PAGERS)
      .forEach((elem, currentIndex) => {
        elem.addEventListener('click', () => {
          if (!elem.classList.contains('active') && !animationOngoing) {
            sliderTarget = currentIndex
            sliderResponse(sliderTarget)
            resetTiming()
          }
        })
      })

    // next/prev controls
    document
      .querySelector(SELECTOR_SLIDER_CONTROL_NEXT)
      .addEventListener('click', () => {
        if (!animationOngoing) {
          const currentActiveElem = document.querySelector(
            SELECTOR_SLIDER_PAGERS_ACTIVE
          )
          const currentActiveIndex = indexOf(
            currentActiveElem.parentElement.children,
            currentActiveElem
          )
          sliderTarget = currentActiveIndex
          sliderTarget = sliderTarget === LAST_ELEM_INDEX ? 0 : sliderTarget + 1
          sliderResponse(sliderTarget)
          resetTiming()
        }
      })
    document
      .querySelector(SELECTOR_SLIDER_CONTROL_PREV)
      .addEventListener('click', () => {
        if (!animationOngoing) {
          const currentActiveElem = document.querySelector(
            SELECTOR_SLIDER_PAGERS_ACTIVE
          )
          const currentActiveIndex = indexOf(
            currentActiveElem.parentElement.children,
            currentActiveElem
          )
          sliderTarget = currentActiveIndex
          sliderTarget = sliderTarget === 0 ? LAST_ELEM_INDEX : sliderTarget - 1
          sliderResponse(sliderTarget)
          resetTiming()
        }
      })
  }
  initPageControl()

  // slider autoplay
  let timingRun = setInterval(() => {
    sliderTiming()
  }, SLIDER_SPEED)

  function resetTiming() {
    clearInterval(timingRun)
    timingRun = setInterval(() => {
      sliderTiming()
    }, SLIDER_SPEED)
  }
})()
