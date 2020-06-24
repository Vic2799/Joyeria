'use strict';

import { getAllProducts, putQuotationProduct, removeProductFromQuotation } from './db/quotation.js'

const API_URL = 'https://itacate.herokuapp.com/api/v1';

// state for user changing weight and/or volume
let isCustomWeight = false;
let isCustomVolume = false;

showQuotationProducts();

productsWeight.onclick = (() => {
    if (!isCustomWeight) {
        const optionModalTitle = document.querySelector('#optionModal .modal-header > h5.modal-title');
        const optionModalBody = document.querySelector('#optionModal .modal-content > div.modal-body');

        optionModalTitle.textContent = 'Modificar peso';
        optionModalBody.textContent = '¿Desea ingresar el peso manualmente?';

        optionModalAccept.onclick = () => {

            isCustomWeight = true;
            productsWeight.readOnly = false;

        }

        $('#optionModal').modal('show');
    }
});

productsVolume.onclick = (() => {
    if (!isCustomVolume) {
        const optionModalTitle = document.querySelector('#optionModal .modal-header > h5.modal-title');
        const optionModalBody = document.querySelector('#optionModal .modal-content > div.modal-body');

        optionModalTitle.textContent = 'Modificar volumen';
        optionModalBody.textContent = '¿Desea ingresar el volumen manualmente?';

        optionModalAccept.onclick = () => {
            isCustomVolume = true;
            productsVolume.readOnly = false;
        }


        $('#optionModal').modal('show');
    }
});

btnQuote.onclick = (event) => {
    event.preventDefault();

    if (!quotationForm.checkValidity()) {
        quotationForm.reportValidity();
    } else {
        const quotBtnSpinner = document.querySelector('#btnQuote > #spnQuotation');
        const quotBtnMessage = document.querySelector('#btnQuote > #msgQuotation');

        quotBtnSpinner.hidden = false;
        quotBtnMessage.textContent = 'Cotizando...';
        btnQuote.disabled = true;

        const formData = new FormData(quotationForm);

        getAllProducts()
            .then(quotationProducts => {
                quotationProducts = quotationProducts.map(quotProduct => {
                    return {
                        id: quotProduct.product_id,
                        quantity: quotProduct.quantity
                    }
                });

                const reqBody = {
                    origin_zip_code: 80000,
                    destination_zip_code: formData.get('zipCode'),
                    products: quotationProducts,
                    package_volume: isCustomVolume ? formData.get('volume') : null, // null values if not custom so backend 
                    package_weight: isCustomWeight ? formData.get('weight') : null, // calculates actual volume/weight
                }

                return fetch(`${API_URL}/quotation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reqBody),
                })
                    .then(res => {
                        if (res.ok) {
                            return res.json();
                        } else {
                            showModal('Error', 'No se pudo crear la cotización correctamente.');

                            const quotBtnSpinner = document.querySelector('#btnQuote > #spnQuotation');
                            const quotBtnMessage = document.querySelector('#btnQuote > #msgQuotation');

                            quotBtnSpinner.hidden = true;
                            quotBtnMessage.textContent = 'Cotizar';
                            btnQuote.disabled = false;
                        }
                    })
                    .then(quotation => {
                        if (quotation) {
                            const url = new URL(window.location);
                            url.pathname = '/cotizaciones.html';
                            url.searchParams.append('quotation', quotation.id);
                            location.href = url.toString();
                        }
                    })
            })
            .catch(error => console.error(error));
    }
}


function showQuotationProducts() {
    showLoading();

    const productList = document.querySelector('#result');

    getAllProducts()
        .then((quotationProducts) => {
            const registries = new Map();

            const fetchData = async () => {
                productList.innerHTML = ''; // clean product list

                // clean shipping values
                productsWeight.value = '';
                productsVolume.value = ''

                const ids = quotationProducts.map((results) => {
                    registries.set(results.product_id, results.quantity);

                    return results.product_id;
                }).join(';')

                const response = await fetch(`${API_URL}/products/${ids}`);
                const results = await response.json();

                if (ids && results.length > 0) {
                    return results;
                } else {
                    return null;
                }
            };

            fetchData()
                .then((products) => {
                    hideLoading();

                    if (products) {
                        let weight = 0;
                        let volume = 0;


                        products.forEach((product) => {
                            const volumePerUnit = (product.length * product.width * product.height);
                            const quantity = registries.get(product.id);

                            weight += (product.weight * quantity);
                            volume += ((volumePerUnit) * quantity);
                            showProductCard(product, quantity)
                        });

                        weight = weight / 1000; // convert grams to kilograms
                        productsWeight.value = Math.round(weight * 10000) / 10000; // round weight to 4 decimal places and display it

                        volume = volume / 1000000; // convert cm^3 to m^3
                        productsVolume.value = Math.round(volume * 10000) / 10000; // round volume to 4 decimal places and display it
                    } else {
                        noProductsFound.hidden = false;
                    }
                })
                .catch(() => {
                    showModal('Error', 'Hubo un error obteniendo productos. Favor de intentar de nuevo.');

                    hideLoading();
                });
        });
}

function showModal(title, message) {
    const defaultModalTitle = document.querySelector('#defaultModal .modal-header > h5.modal-title');
    const defaultModalBody = document.querySelector('#defaultModal .modal-content > div.modal-body');

    defaultModalTitle.textContent = title;
    defaultModalBody.textContent = message;

    $('#defaultModal').modal('show');
}

function showLoading() {
    const loadingSpinner = document.querySelector('#loading');
    loadingSpinner.hidden = false;
    loadingSpinner.classList.add('d-flex');
}

function hideLoading() {
    const loadingSpinner = document.querySelector('#loading');
    loadingSpinner.classList.remove('d-flex');
    loadingSpinner.hidden = true;
}

function showProductCard(product, quantity) {
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
        removeProductFromQuotation(product.id)
            .then(() => showQuotationProducts())
            .catch(() =>
                showModal('Error', 'Hubo un error al intentar eliminar un producto de la cotización. Favor de intentar de nuevo.'));
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

        cardQuantValue.onclick = () => {
            putQuotationProduct(product.id, Number(cardQuantValue.textContent))
                .then(() => showQuotationProducts())
                .catch(() => showModal('Error', 'Hubo un error al insertar producto a la cotización. Favor de intentar de nuevo.'));
        }

        if (value === quantity)
            cardQuantValue.classList.add('active');

        cardQuantValue.href = '#';
        cardQuantValue.textContent = value;

        cardQuantityValues.appendChild(cardQuantValue);
    });

    cardQuantityDropdown.appendChild(cardQuantity);
    cardQuantityDropdown.appendChild(cardQuantityValues);

    cardTitle.textContent = `${product.title}`;

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
