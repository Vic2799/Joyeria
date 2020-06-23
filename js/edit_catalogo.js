'use strict';



const API_URL = 'https://itacate.herokuapp.com/api/v1';
let categoryList;

fetch(`${API_URL}/categories`)
    .then(response => response.json())
    .then((categories) => {
        categoryList = categories;
        const categoryResult = document.querySelector('#result');
    categoryResult.innerHTML = '';

        categoryList.forEach((category) => {
            showCategoryCard(category);
        })
    })
    .catch(() => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error obteniendo las categorias. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    });
function showCategoryCard(category) {
    const categoryList = document.querySelector('#result');

    const div = document.createElement('div');
    div.classList.add('col-sm-4', 'col-lg-3', 'py-2');

    const card = document.createElement('div');
    card.classList.add('card', 'mb-4', 'w-100');
    card.style.minWidth = '10rem';

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

    cardTitle.textContent = `${category.title}`;

    cardBody.appendChild(cardTitle);

    cardFooter.appendChild(removeProductButton);

    // card.appendChild(img);
    // card.append(document.createElement('hr')); // add separator
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    // div.appendChild(card);

    categoryList.appendChild(card);
}

function removeCategoryFromQuotation(categoryId) {
    return new Promise((resolve, reject) => {
        getDatabase()
            .then(db => {
                const transaction = db.transaction(['category'], 'readwrite');

                const objectStore = transaction.objectStore('category');

                objectStore.delete(categoryId);

                transaction.oncomplete = () => {
                    resolve();
                };

                transaction.onerror = () => {
                    reject();
                };
            });
    });
}
