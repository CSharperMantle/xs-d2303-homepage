(function () {
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
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js',
        body,
        () => {
          return typeof gsap !== 'undefined'
        },
        false,
        null,
        null
      )
    })
    .then(() => {
      return AsyncScriptLoader.loadScript(
        'https://cdn.jsdelivr.net/gh/CSharperMantle/xs-d2303-homepage@main/assets/js/CustomEase-3.5.1.min.js',
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
        'https://cdn.jsdelivr.net/gh/CSharperMantle/xs-d2303-homepage@main/assets/js/CustomWiggle-3.4.3.min.js',
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
      initializeComponents()
    })
    .catch((reason) => {
      console.log(reason)
    })
})()

let isTextShowing = false
let onShowTextPanelSelector = ''

function initializeComponents() {
  const tl = gsap.timeline()

  tl.from('.text-place', {
    opacity: 0,

    duration: 1,
    stagger: 0.5,
    ease: 'none'
  })
  tl.from('.dot', {
    y: '+=20',
    opacity: 0,

    duration: 0.5,
    delay: 0.2,
    stagger: 0.2,
    ease: 'power2'
  })

  const dots = document.getElementsByClassName('dot')
  for (let i = 0; i < dots.length; i++) {
    const elem = dots[i]
    elem.addEventListener('click', () => {
      showText(elem.id)
    })
  }

  function showText(id) {
    const textPanelSelector = '#g-text-' + id.substr(-2)

    if (onShowTextPanelSelector === textPanelSelector) {
      gsap.to('#rect-text-background', {
        opacity: 0,
        duration: 1,
        ease: 'none'
      })
      gsap.to(onShowTextPanelSelector, {
        opacity: 0,
        duration: 1,
        ease: 'none'
      })
      onShowTextPanelSelector = ''
      isTextShowing = false
      return
    }

    if (isTextShowing) {
      const tl = gsap.timeline()
      tl.to(onShowTextPanelSelector, {
        opacity: 0,
        duration: 1,
        ease: 'none'
      })
      tl.to(textPanelSelector, {
        opacity: 1,
        duration: 1,
        ease: 'none'
      })
      onShowTextPanelSelector = textPanelSelector
      isTextShowing = true
    } else {
      gsap.to('#rect-text-background', {
        opacity: 0.3,
        duration: 1,
        ease: 'none'
      })
      gsap.to(textPanelSelector, {
        opacity: 1,
        duration: 1,
        ease: 'none'
      })
      onShowTextPanelSelector = textPanelSelector
      isTextShowing = true
    }
  }
}
