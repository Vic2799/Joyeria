'use strict';

import { getAllCategories, putQuotationProduct, removeProductFromQuotation } from '../js/db/quotation.js'

showQuotationCategories();


const API_URL = 'https://itacate.herokuapp.com/api/v1';

function showQuotationCategories() {
    showLoading();

    const productList = document.querySelector('#result');

    getAllCategories()
        .then((quotationCategories) => {
            const registries = new Map();

            const fetchData = async () => {
                productList.innerHTML = ''; // clean product list

                const ids = quotationCategories.map((results) => {
                    registries.set(results.category_id, results.title);

                    return results.category_id;
                }).join(';')

                const response = await fetch(`${API_URL}/categories/${ids}`);
                const results = await response.json();

                if (ids && results.length > 0) {
                    return results;
                } else {
                    return null;
                }
            };


        });
}

function showCategoryCard(category, quantity) {
    const productList = document.querySelector('#result');

    const div = document.createElement('div');
    div.classList.add('col-sm-4', 'col-lg-3', 'py-2');

    const card = document.createElement('div');
    card.classList.add('card', 'mb-4', 'w-100');
    card.style.minWidth = '10rem';

    // const img = document.createElement('img');
    // img.classList.add('card-img-top');
    // img.src = product.image_url || 'https://cdn.onlinewebfonts.com/svg/img_148071.png';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-text');

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer', 'd-flex', 'justify-content-between', 'px-1');

    const removeProductButton = document.createElement('button');
    removeProductButton.classList.add('btn', 'btn-link');
    removeProductButton.textContent = 'Eliminar';
    removeProductButton.onclick = () => {
        removeProductFromQuotation(category.id)
            .then(() => showQuotationProducts())
            .catch(() =>
                showModal('Error', 'Hubo un error al intentar eliminar una categoria de la lista. Favor de intentar de nuevo.'));
    };

    const cardQuantityDropdown = document.createElement('div');
    cardQuantityDropdown.classList.add('dropdown');

    const cardQuantity = document.createElement('button');
    cardQuantity.classList.add('btn', 'btn-secondary', 'dropdown-toggle');
    cardQuantity.type = 'button';
    cardQuantity.id = 'productQuantityDropdownButton';
    cardQuantity.dataset.toggle = 'dropdown';
    cardQuantity.ariaHasPopup = 'true';
    cardQuantity.ariaExpanded = 'false';
    cardQuantity.textContent = quantity;

    const cardQuantityValues = document.createElement('div');
    cardQuantityValues.classList.add('dropdown-menu');

    [...Array(20).keys()].forEach((number) => {
        const value = number + 1;
        const cardQuantValue = document.createElement('a');
        cardQuantValue.classList.add('dropdown-item');


        if (value === quantity)
            cardQuantValue.classList.add('active');

        cardQuantValue.href = '#';
        cardQuantValue.textContent = value;

        cardQuantityValues.appendChild(cardQuantValue);
    });

    cardQuantityDropdown.appendChild(cardQuantity);
    cardQuantityDropdown.appendChild(cardQuantityValues);

    cardTitle.textContent = `${category.title}`;

    cardBody.appendChild(cardTitle);

    cardFooter.appendChild(removeProductButton);
    cardFooter.appendChild(cardQuantityDropdown);

    // card.appendChild(img);
    // card.append(document.createElement('hr')); // add separator
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    // div.appendChild(card);

    productList.appendChild(card);
}
