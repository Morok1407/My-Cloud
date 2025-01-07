'use strict';

function showPrice() {
    const priceItem = document.querySelectorAll('.price__body-item')

    priceItem.forEach((item, index) => {
        item.addEventListener('click', () => {
            const priceName = priceItem[index].querySelector('.price__body-name')
            const priceLink = priceItem[index].querySelector('.price__body-link')
            
            if(priceName.classList.contains('price__body-name--active') || priceLink.classList.contains('price__body-link--active')) {
                priceName.classList.remove('price__body-name--active')
                priceLink.classList.remove('price__body-link--active')
            } else {
                priceName.classList.add('price__body-name--active')
                priceLink.classList.add('price__body-link--active')
            }
        })
    })
}showPrice()