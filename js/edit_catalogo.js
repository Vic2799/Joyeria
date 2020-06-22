'use strict';


const API_URL = 'https://itacate.herokuapp.com/api/v1';
let categoryList;

fetch(`${API_URL}/categories`)
    .then(response => response.json())
    .then((categories) => {
        categoryList = categories;
    })
    .then(() => showCategories())
    .catch(() => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error obteniendo las categorias. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    });


function showCategories(categoryId) {
    const categoryResult = document.querySelector('#result');
    categoryResult.innerHTML = '';
    if (categoryId) {
        categoryList.filter((category) => categories.id === categoryId)
            .forEach((category) => {
                showCategoryCard(category);
            })

    } else {
        categoryList.forEach((category) => {
            showCategoryCard(category);
        })
    }



}


function showCategoryCard(category) {
    const categoryList = document.querySelector('#result');

    const div = document.createElement('div');
    div.classList.add('col-sm-4', 'col-lg-3', 'py-2');
     card.style.minWidth = '10rem';


    const img = document.createElement('img');
     img.classList.add('card-img-top');
     img.src = product.image_url || 'https://cdn.onlinewebfonts.com/svg/img_148071.png';

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
        removeCategoryFromQuotation(category.id)
            .then(() => showQuotationCategories())
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

    categoryList.appendChild(card);
}
