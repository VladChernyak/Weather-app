$('document').ready(function() {
  $('.daily-weather__carousel').owlCarousel({
    loop: false,
    margin: 10,
    responsive: {
      0: {
        mouseDrag: true,
        touchDrag: true,
        items: 2,
      },
      376: {
        items: 3,
      },
      959: {
        mouseDrag: false,
        touchDrag: false,
        items: 7
      }

    }
  })

  $('.hourly-weather__carousel').owlCarousel({
    loop: false,
    margin: 10,
    responsive: {
      0: {
        mouseDrag: true,
        touchDrag: true,
        items: 3,
      },
      376: {
        items: 4,
      },
      959: {
        mouseDrag: false,
        touchDrag: false,
        items: 7
      }

    }
  })
})
