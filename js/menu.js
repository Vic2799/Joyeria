'use strict';

import { putQuotationProduct } from '../js/db/quotation.js'

let productList;
const API_URL = 'https://itacate.herokuapp.com/api/v1';

fetch(`${API_URL}/products`)
    .then(response => response.json())
    .then((products) => {
        productList = products;
    })
    .then(() => showMenu())
    .catch(() => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error obteniendo productos. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    });

function showMenu() {
    //  const value = 1;
    const category = document.querySelector('#menu');
    category.innerHTML = '';
    const ul = document.createElement('ul');
    ul.classList.add('tabs');
    const li = document.createElement('li');
    const a = document.createElement('a');
    const span = document.createElement('span');
    span.textContent = 'Todos';
    span.classList.add('tab-text');
    a.onclick = (() => showProducts(0));
    li.dataset.id = 0;
    a.appendChild(span);
    li.appendChild(a);
    ul.appendChild(li);

    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then((categories) => {
            categories.forEach((category) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                const span = document.createElement('span');
                //a.href= '#tab'+category.id;
                a.onclick = (() => showProducts(category.id));
                span.textContent = category.title;
                span.classList.add('tab-text');

                li.dataset.id = category.id;
                a.appendChild(span);
                li.appendChild(a);
                ul.appendChild(li);

            });
            category.appendChild(ul);
        }).catch(() => {
            const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
            errorModalBody.textContent = 'Hubo un problema al obtener las categorías, por favor intente más tarde. ';
            $('#errorModal').modal('show');
        });


}

function showProducts(categoryId) {

    const productResult = document.querySelector('#result');
    productResult.innerHTML = '';
    if (categoryId) {
        productList.filter((product) => product.id_category === categoryId)
            .forEach((product) => {
                showProductCard(product);
            })

    } else {

        productList.forEach((product) => {
            showProductCard(product);
        })
    }
}

function showProductCard(product) {
    const productList = document.querySelector('#result');

    const card = document.createElement('div');
    card.classList.add('card', 'mb-4', 'w-100');
    card.style.minWidth = '10rem';

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = product.image_url || 'https://cdn.onlinewebfonts.com/svg/img_148071.png';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // const addIconLink = document.createElement('a');
    // addIconLink.href = '#';

    // const addIcon = document.createElement('i');
    // addIcon.classList.add('fa', 'fa-plus-square', 'fa-2x', 'ml-1', 'text-primary', 'shadow-sm');

    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-text');

    cardTitle.textContent = `${product.title}`;

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    const cardAddButton = document.createElement('button');
    cardAddButton.classList.add('btn', 'btn-primary', 'w-100');
    cardAddButton.textContent = 'Agregar';
    cardAddButton.onclick = () => {
        // $('#successToast').toast('show');
        // $('#errorToast').toast('show');
    }

    const separator = document.createElement('hr');
    separator.classList.add('my-1');

    // addIconLink.appendChild(addIcon);

    cardBody.appendChild(cardTitle);
    cardFooter.appendChild(cardAddButton);
    card.appendChild(img);
    card.appendChild(separator); // add separator
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    productList.appendChild(card);
}
