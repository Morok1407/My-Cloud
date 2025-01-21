"use strict";

function showPrice() {
  const priceItem = document.querySelectorAll(".price__body-item");

  priceItem.forEach((item, index) => {
    item.addEventListener("click", () => {
      const priceNameIn = priceItem[index].querySelector(".price__body-name");
      const priceLinkIn = priceItem[index].querySelector(".price__body-link");

      if (
        priceNameIn.classList.contains("price__body-name--active") ||
        priceLinkIn.classList.contains("price__body-link--active")
      ) {
        priceNameIn.classList.remove("price__body-name--active");
        priceLinkIn.classList.remove("price__body-link--active");
        setTimeout(() => {
          priceLinkIn.style.display = 'none'
        }, 200)
      } else {
        priceLinkIn.style.display = 'flex'
        setTimeout(() => {
          priceNameIn.classList.add("price__body-name--active");
          priceLinkIn.classList.add("price__body-link--active");
        }, 50)
      }
    });
  });
}
showPrice();

function showAccord() {
  const accordItem = document.querySelectorAll(".faq__accord-item");
  const accordLink = document.querySelectorAll(".faq__accord-link");
  const plusminus = document.querySelectorAll(".plusminus");

  accordItem.forEach((item, index) => {
    item.addEventListener("click", () => {
      const accordLinkIn = accordItem[index].querySelector(".faq__accord-link");
      const plusminusIn = accordItem[index].querySelector(".plusminus");

      if (!accordLinkIn.classList.contains("faq__accord-link--active")) {
        accordLink.forEach((e) => {
          e.classList.remove("faq__accord-link--active");
        });
        plusminus.forEach((e) => {
          e.classList.remove("active");
        });

        plusminusIn.classList.add("active");
        accordLinkIn.classList.add("faq__accord-link--active");
      } else {
        plusminusIn.classList.remove("active");
        accordLinkIn.classList.remove("faq__accord-link--active");
      }
    });
  });
}
showAccord();

function moveUp() {
  const button = document.getElementById("footer-title");

  button.addEventListener("click", (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
moveUp();

function registerSwitch() {
  const buttonSwitch = document.getElementById("switch");
  const switchLink = document.querySelector(".register__switch-link");
  const loginHead = document.getElementById("login-head");
  const registerHead = document.getElementById("register-head");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  buttonSwitch.addEventListener("click", () => {
    switchLink.classList.toggle("register__switch-end");

    if (registerHead.classList.contains("register__head--acitve")) {
      registerForm.style.opacity = "0";
      registerHead.style.opacity = "0";
      setTimeout(() => {
        registerHead.classList.remove("register__head--acitve");
        registerForm.classList.remove("register__form--active");
        loginHead.classList.add("login__head--active");
        loginForm.classList.add("login__form--active");
        setTimeout(() => {
          loginHead.style.opacity = "1";
          loginForm.style.opacity = "1";
        }, 300);
      }, 300);
    } else {
      loginForm.style.opacity = "0";
      loginHead.style.opacity = "0";
      setTimeout(() => {
        loginHead.classList.remove("login__head--active");
        loginForm.classList.remove("login__form--active");
        registerHead.classList.add("register__head--acitve");
        registerForm.classList.add("register__form--active");
        setTimeout(() => {
          registerHead.style.opacity = "1";
          registerForm.style.opacity = "1";
        }, 300);
      }, 300);
    }
  });
}
registerSwitch();

document.getElementById("change-captcha").addEventListener("click", () => {
  const captcha = document.getElementById("captcha");
  captcha.src = `/api/captcha?${Date.now()}`;
});

document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const rePassword = document.getElementById("register-re-password").value;
    const captchaResponse = document.getElementById("captcha-response").value;

    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        rePassword,
        captchaResponse,
      }),
    });

    const data = await response.json();
      if (data.success) {
        window.location.href = data.message
      } else {
        alert('Ошибка регистрации: ' + data.message);
        if (data.message === 'Неверный код с картинки') {
          document.getElementById('captchaResponse').src = `/api/captcha?${new Date().getTime()}`;
        }
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify ({
      email,
      password
    })
  })

  const data = await response.json()
  if(data.success) {
    window.location.href = data.message
  } else {
    alert('Ошибка регистрации: ' + data.message);
  }
})