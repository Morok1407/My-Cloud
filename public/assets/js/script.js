'use strict';

function showPrice() {
    const priceItem = document.querySelectorAll('.price__body-item')

    priceItem.forEach((item, index) => {
        item.addEventListener('click', () => {
            const priceNameIn = priceItem[index].querySelector('.price__body-name')
            const priceLinkIn = priceItem[index].querySelector('.price__body-link')

            if(priceNameIn.classList.contains('price__body-name--active') || priceLinkIn.classList.contains('price__body-link--active')) {
                priceNameIn.classList.remove('price__body-name--active')
                priceLinkIn.classList.remove('price__body-link--active')
            } else {
                priceNameIn.classList.add('price__body-name--active')
                priceLinkIn.classList.add('price__body-link--active')
            }
        })
    })
}showPrice()

function showAccord(){
    const accordItem = document.querySelectorAll('.faq__accord-item')
    const accordLink = document.querySelectorAll('.faq__accord-link')
    const plusminus = document.querySelectorAll('.plusminus');

    accordItem.forEach((item, index) => {
        item.addEventListener('click', () => {
            const accordLinkIn = accordItem[index].querySelector('.faq__accord-link')
            const plusminusIn = accordItem[index].querySelector('.plusminus');

            if(!accordLinkIn.classList.contains('faq__accord-link--active')) {
                accordLink.forEach(e => {
                    e.classList.remove('faq__accord-link--active')
                })
                plusminus.forEach(e => {
                    e.classList.remove('active')
                })
                
                plusminusIn.classList.add('active')
                accordLinkIn.classList.add('faq__accord-link--active')
            } else {
                plusminusIn.classList.remove('active')
                accordLinkIn.classList.remove('faq__accord-link--active')
            }
        })
    })
}showAccord()