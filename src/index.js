import './css/styles.css';

import { debounce } from 'lodash';

import Notiflix from 'notiflix';

import { fetchCountries } from './js/fetchCountires';

const DEBOUNCE_DELAY = 300;

let inputEl = document.querySelector('input#search-box');
let countryListEl = document.querySelector('.country-list');
let countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function setMarkUp(el, markup) {
    return (el.innerHTML = markup);
}

function markUpCleaner() {
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = '';
}

function onInput(e) {
    markUpCleaner()
    const inputValue = e.target.value.trim();

    if (inputValue !== "") {
        fetchCountries(inputValue)
            .then(data => {
                if (data.length > 10) {
                    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");

                } else if (data.length >= 2 && data.length <= 10) {
                    const markUp = countriesListMarkup(data);
                    setMarkUp(countryListEl, markUp)

                } else if (data.length === 1) {
                    const markUp = countryMarkup(data);
                    setMarkUp(countryInfoEl, markUp)

                } else if (data.length === 0) {
                    Notiflix.Notify.failure('Oops, there is no country with that name');
                }
            })
    }
}

function countryMarkup(array) {
    return array.map(({ flags: { svg }, name: { official }, capital, population, languages }) => {
        return `<div class="wrapper">
            <img src="${svg}" alt="Flag of ${official}" width="30" height="20">
                <h2 class="country-name">${official}</h2>
                <p>Capital: ${capital}</p>
                <p>Population: ${population.toString()}</p>
                <p>Languages: ${Object.values(languages)}</p>
        </div>`
    }).join('')

}

function langArr(arr) {
    return Object.values(arr);
}

function countriesListMarkup(array) {
    return array.map(({ flags: { svg }, name: { official } }) => {
        return `<li class="country-list__item">
            <img src="${svg}" alt="Flag of ${official}" width="30" height="20">
                <h2 class="country-name">${official}</h2>
        <li>`
    }).join('')

}
