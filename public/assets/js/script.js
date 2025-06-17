// Включение строго режима JavaScript
("use strict");

// Функция показа цен
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

// Аккордеон с часто задаваемыми вопросами
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

// Быстрое поднятие вверх
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

// Выбор между регистрацией и входом
function registerSwitch() {
  const buttonSwitch = document.getElementById("switch");
  const switchLink = document.querySelector(".register__switch-link");
  const loginHead = document.getElementById("login-head");
  const registerHead = document.getElementById("register-head");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const codeConfirmHead = document.getElementById("code-confirm-head").style.display = 'none';
  const codeConfirmForm = document.getElementById("code-confirm-form").style.display = 'none';
  
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

// Открытие формы для отправки кода
function codeConfirm() {
  const buttonSwitch = document.getElementById("switch").style.display = 'none';
  const loginHead = document.getElementById("login-head").style.display = 'none';
  const registerHead = document.getElementById("register-head").style.display = 'none';
  const loginForm = document.getElementById("login-form").style.display = 'none';
  const registerForm = document.getElementById("register-form").style.display = 'none';
  
  const codeConfirmHead = document.getElementById("code-confirm-head").style.display = 'flex';
  const codeConfirmForm = document.getElementById("code-confirm-form").style.display = 'flex';
  
  const inputs = document.querySelectorAll(".code-confirm-input");
  
  inputs.forEach((input, index) => {
    input.addEventListener('focus', (e) => {
      const fistInput = inputs[index - 1].value
      if(fistInput.length < 1) {
        inputs[index - 1].focus();
      }
    })

    input.addEventListener("input", (e) => {
      const value = e.target.value.toUpperCase();
      e.target.value = value;

      if (value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
}

async function codeConfirmSendAgain() {
  const codeConfirmButton = document.querySelector('.code-confirm__form-again-button')
  const codeConfirmTimer = document.getElementById('code-confirm-timer')
  let timer = 59

  codeConfirmTimer.style.display = 'flex'
  codeConfirmButton.style.display = 'none'
  codeConfirmTimer.textContent = timer
  
  let codeConfirmInterval = setInterval(() => {
    codeConfirmTimer.textContent = timer--
  }, 1000)
  
  setTimeout(() => {
    console.log('End')
    clearInterval(codeConfirmInterval)
    codeConfirmButton.style.display = 'flex'
    codeConfirmTimer.style.display = 'none'
  }, 62000)
}

function onElementLoaded(selector, callback) {
  const targetNode = document.body;
  const observerOptions = {
    childList: true,
    subtree: true
  };

  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      observer.disconnect();
    }
  });

  observer.observe(targetNode, observerOptions);
}

onElementLoaded(".main-register", async (el) => {
  const response = await fetch("/auth/checkVerificat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (data.success) {
    console.log(data.message)
  } else {
    if(data.message == 'Not verification') {
      codeConfirm()
    }
  }
});

// Отправка кода на сервер для подтверждения
document.getElementById('code-confirm-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll(".code-confirm-input");
  let code = ''
  inputs.forEach(i => {
    code += i.value
  });

  const response = await fetch("/auth/codeConfirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  code = ''
  const data = await response.json();
    if (data.success) {
      window.location.href = data.message
    } else {
      alert('Ошибка регистрации: ' + data.message);
  }
})

// Форма регистрации
document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const rePassword = document.getElementById("register-re-password").value;

    if(password.length < 6) {
      return alert('Пароль должен содержать больше 6 символом.')
    }

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
      }),
    });

    const data = await response.json();
      if (data.success) {
        codeConfirm()
      } else {
        alert('Ошибка регистрации: ' + data.message);
      }
});

// Форма входа
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
    if(data.message == 'Not verification') {
      codeConfirm()
    } else {
      alert('Ошибка регистрации: ' + data.message);
    }
  }
})