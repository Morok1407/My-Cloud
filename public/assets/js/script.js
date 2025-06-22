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

document.getElementById('contact-submit').addEventListener('click', async (e) => {
  e.preventDefault()
  const email = document.getElementById('contact-input-email').value
  const name = document.getElementById('contact-input-name').value
  const text = document.getElementById('contact-input-text').value
  
  try {
        const response = await fetch('/api/sendMeMessage', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                name,
                text
            })
        })
        const data = await response.json()
        alert('Сообщение отправленно')
        email.value = ''
        name.value = ''
        text.value = ''
        if(!data.success) {
            setTimeout(() => {
                showWarn(data.error)
            }, 100)
        }  
    } catch (error) {
        console.error(error);
        setTimeout(() => {
            showWarn(error)
        }, 100)
    }
})