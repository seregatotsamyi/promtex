window.onload = function () {
  "use strict";
  //mask-tel
  [].forEach.call(document.querySelectorAll(".tel"), function (input) {
    var keyCode;

    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___)-___-__-__",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i);
      }
      var reg = matrix
        .substr(0, this.value.length)
        .replace(/_+/g, function (a) {
          return "\\d{1," + a.length + "}";
        })
        .replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");

      if (!reg.test(this.value) || this.value.length < 5 || (keyCode > 47 && keyCode < 58)) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = "";
    }
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  });

  const body = document.getElementById("body");

  //pop-up start
  const popupLinks = document.querySelectorAll(".popup--link");
  const lockPadding = document.querySelectorAll(".lock--padding");
  const lockPaddingItem = document.querySelectorAll(".lock--padding--item");
  const lockPaddingValue = window.innerWidth - document.querySelector(".body").offsetWidth + "px";

  let unlock = true;

  const timeOut = 500;

  if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener("click", function (e) {
        const popupName = popupLink.getAttribute("href").replace("#", "");
        const curentPopup = document.getElementById(popupName);

        popupOpen(curentPopup);

        e.preventDefault();
      });
    }
  }

  const popupCloseIcon = document.querySelectorAll(".popup--close");
  if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener("click", function (e) {
        popupClose(el.closest(".popup"));
        e.preventDefault();
      });
    }
  }

  function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
      const popupActive = document.querySelector(".popup.open");
      if (popupActive) {
        popupClose(popupActive, false);
      } else {
        bodyLock();
      }
      curentPopup.classList.add("open");
      curentPopup.addEventListener("click", function (e) {
        if (!e.target.closest(".popup__content")) {
          popupClose(e.target.closest(".popup"));
        }
      });
    }
  }

  function popupClose(popupActive, doUnlock) {
    if (unlock) {
      popupActive.classList.remove("open");
      if (doUnlock === undefined) {
        bodyUnLock();
      }
    }
  }

  function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector(".body").offsetWidth + "px";
    body.style.paddingRight = lockPaddingValue;
    body.classList.add("_fixed");
    unlock = false;
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
      }
    }
    setTimeout(function () {
      unlock = true;
    }, timeOut);
  }

  function bodyUnLock() {
    setTimeout(function () {
      if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = "0px";
        }
      }
      if (lockPaddingItem.length > 0) {
        for (let index = 0; index < lockPaddingItem.length; index++) {
          const el = lockPaddingItem[index];
          let currentValue = parseInt(getComputedStyle(el).right);
          let finalValue = currentValue - parseInt(lockPaddingValue) + "px";
          el.style.right = finalValue;
        }
      }
      body.style.paddingRight = "0px";
      body.classList.remove("_fixed");
    }, timeOut);

    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeOut);
  }
  document.addEventListener("keydown", function (e) {
    if (e.which === 27) {
      const popupActive = document.querySelectorAll(".popup.open");
      popupClose(popupActive);
    }
  });
  //pop-up end

  //menu
  const menu = document.getElementById("menu");
  const btns = document.querySelectorAll(".toggle-menu");

  btns.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("_open");
      body.classList.toggle("_fixed");
    });
  });
  //menu

  const swiperReviews = new Swiper(".reviews__slider", {
    loop: true,
    slideToClickedSlide: true,
    spaceBetween: 15,
    slidesPerView: 1.2,
    navigation: {
      nextEl: ".reviews__arrow._next",
      prevEl: ".reviews__arrow._prev",
    },
    autoplay: {
      delay: 6000,
    },
    breakpoints: {
      769: {
        slidesPerView: 1.8,
      },
      1025: {
        slidesPerView: 2.2,
      },
    },
  });
};
