/* Javascript for Garage door configuration 
    =======
*/

console.log('Hello in building configuration :-)'); 

const lengthUnit = 'mm';

/* Block 01 
    =======
*/

const block01 = document.getElementsByClassName('block-01');

let block01Arrow = false;

const sirkaOtvoruMin = 500;
const sirkaOtvoruMax = 6500;

const vyskaOtvoruMin = 1250;
const vyskaOtvoruMax = 4300;

const sirkaOtvoruInput = document.getElementById('input-sirka');
const vyskaOtvoruInput = document.getElementById('input-vyska');

/* Block 02 
    =======
*/
const block02 = document.getElementsByClassName('block-02');

const typVrat01 = document.getElementById('typ-vrat-01');
const typVrat02 = document.getElementById('typ-vrat-02');
const typVrat03 = document.getElementById('typ-vrat-03');

const setTypeDoor = (width, height) => {
    width = Number(width);
    height = Number(height);

    // if width > 4000mm
    typVrat01.disabled = width > 3999;

    // if width < 4000mm
    typVrat02.disabled = width < 4000;

    // if width > 3000mm || height > 3000mm
    typVrat03.disabled = (width > 3000 || height > 3000);

}

/* Block 03 
    ==========
*/

const block03 = document.getElementsByClassName('block-03');

// Pohon
const pohonVrat01 = document.getElementById('pohon-vrat-01');
const pohonVrat02 = document.getElementById('pohon-vrat-02');
const pohonVrat03 = document.getElementById('pohon-vrat-03');
const pohonVrat04 = document.getElementById('pohon-vrat-04');
const pohonVrat05 = document.getElementById('pohon-vrat-05');

// Barva
const barvaVratArray = [
    {
        id: 1, 
        name: 'Bílá', 
        value: 'bila'
    }, 
    {
        id: 2, 
        name: 'Hnědá', 
        value: 'hneda'
    },
    {
        id: 3, 
        name: 'Modrá', 
        value: 'modra'
    },
    {
        id: 4, 
        name: 'Červená', 
        value: 'cervena'
    },
    {
        id: 5, 
        name: 'RAL 8014', 
        value: 'zlaty_dub'
    }, 
    {
        id: 6, 
        name: 'RAL 7016', 
        value: 'antracitova'
    }
];

const generateBarvaVrat = (params) => {

    const barvaVrat = document.getElementById('barva-vrat');
    barvaVrat.innerHTML = '';

    let barvaVratArrayFilter = barvaVratArray.filter( (item, index) => {
        console.log(params[index]);
        item.value !== params[index]
    });
    console.log(barvaVratArrayFilter);

    for (let j = 0; j < barvaVratArray.length; j++) {
        let opt = document.createElement('option');
        opt.value = barvaVratArray[j].value;
        opt.innerHTML = barvaVratArray[j].name;
        barvaVrat.appendChild(opt);
    }

    let barvaVratPocet = document.getElementById('barva-vrat-pocet').innerHTML = barvaVratArray.length;   
}

// Doplnky
const doplnkyVrat = document.getElementById('doplnky-vrat');


// ------------

// remove 'is-invalid' class for all input´s
const allInputs = document.querySelectorAll('.form-control');

for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].classList.remove('is-valid', 'is-invalid');
}

// helper function 'add class'
let addClass = (item, state) => {
    item.classList.add(state == 'is-valid' ? 'is-valid' : 'is-invalid');
}

// helper function 'remove class'
let removeClass = (item, state) => {
    item.classList.remove(state == 'is-valid' ? 'is-valid' : 'is-invalid');   
}

let hasClass = (item, className) => {
    return item.className.indexOf(className) > -1;
}

// set placeholder for input
sirkaOtvoruInput.placeholder = `${sirkaOtvoruMin} - ${sirkaOtvoruMax}${lengthUnit}`;
vyskaOtvoruInput.placeholder = `${vyskaOtvoruMin} - ${vyskaOtvoruMax}${lengthUnit}`;

let controlInputValue = (data, min, max) => {
    let value = data.target.value;
    let item = data.target;
    let isDimensionAllRight = (value < min || value > max);

    if (isDimensionAllRight) {
        removeClass(item, 'is-valid');
        addClass(item, 'is-invalid');
    } else {
        removeClass(item, 'is-invalid');
        addClass(item, 'is-valid');
    }

    block01Arrow = ( hasClass(sirkaOtvoruInput, 'is-valid') && hasClass(vyskaOtvoruInput, 'is-valid') ) > 0 ? true : false;

    setTimeout(() => {
        setTypeDoor(sirkaOtvoruInput.value, vyskaOtvoruInput.value);
    }, 300);

    if (block01Arrow) {
        block01[0].classList.add('block-correct');
        block02[0].classList.remove('hidden');
        generateBarvaVrat(['modra', 'cervena']);
    } else {
        block01[0].classList.remove('block-correct');
        block02[0].classList.add('hidden');
    }
}

sirkaOtvoruInput.addEventListener('input', (data) => controlInputValue(data, sirkaOtvoruMin, sirkaOtvoruMax));
vyskaOtvoruInput.addEventListener('input', (data) => controlInputValue(data, vyskaOtvoruMin, vyskaOtvoruMax));

// Pohon
document.querySelectorAll('.input-radio-pohon').forEach(element => {
    element.addEventListener('change', function() {

        const pohonVrat01 = this.id == 'pohon-vrat-01' && this.checked;
        const pohonVrat05 = this.id == 'pohon-vrat-05' && this.checked;

        pohonVrat01 ? doplnkyVrat.classList.add('opacity-50') : doplnkyVrat.classList.remove('opacity-50');

        doplnkyVrat04.checked = pohonVrat05 ? true : false;
        doplnkyVrat04.disabled = pohonVrat05 ? true : false;
    })
});

// Doplnky
const doplnkyVrat04 = document.getElementById('doplnky-vrat-04');

// const doplnkyVratCheckboxes = document.getElementsByName('doplnky-vrat');


// doplnkyVratCheckboxes.forEach( element => {
//     element.addEventListener('change', function() {

//     })
// })


