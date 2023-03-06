/* Javascript for Garage door configuration 
    =======
*/

console.log('Hello in building configuration :-)'); 

/**
 * Set variables, array, object
 */

const lengthUnit = 'mm';
const sirkaOtvoruMin = 500;
const sirkaOtvoruMax = 6500;

const vyskaOtvoruMin = 1250;
const vyskaOtvoruMax = 4300;

// Color door
const colorDoorArray = [
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
    // {
    //     id: 5, 
    //     name: 'RAL 8014', 
    //     value: 'zlaty_dub'
    // }, 
    {
        id: 6, 
        name: 'RAL 7016', 
        value: 'antracitova'
    }
];

// Drive door

const driveDoorArray = [
    {
        id: 106, 
        type: 'nepotřebuji pohon',
        power: '', 
        info: ''
    },
    {
        id: 14, 
        type: 'Pohon', 
        power: 500,
        info: ''
    },
    {
        id: 18, 
        type: 'Pohon', 
        power: 800,
        info: ''
    },
    {
        id: 8, 
        type: 'Pohon', 
        power: 850,
        info: 'XL růžový'
    }, 
    {
        id: 42, 
        type: 'Pohon', 
        power: 1000,
        info: 'MAX'
    }
];

/* Block 01 
    =======
*/

const block01 = document.querySelector('.block-01');

const sirkaOtvoruInput = document.getElementById('input-width');
const vyskaOtvoruInput = document.getElementById('input-height');

/* Block 02 
    =======
*/
const block02 = document.querySelector('.block-02');


const typeDoor01 = document.getElementById('type-door-01');
const typeDoor02 = document.getElementById('type-door-02');
const typeDoor03 = document.getElementById('type-door-03');

/* Block 03 
    ==========
*/

const block03 = document.querySelector('.block-03');

// ------------

// Remove 'is-invalid' class for all input´s
const allInputs = document.querySelectorAll('.form-control');

for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].classList.remove('is-valid', 'is-invalid');
}

// Helper function 'add class'
let addClass = (item, state) => {
    item.classList.add(state == 'is-valid' ? 'is-valid' : 'is-invalid');
}

// Helper function 'remove class'
let removeClass = (item, state) => {
    item.classList.remove(state == 'is-valid' ? 'is-valid' : 'is-invalid');   
}

let hasClass = (item, className) => {
    return item.className.indexOf(className) > -1;
}

// Set placeholder for input
sirkaOtvoruInput.placeholder = `${sirkaOtvoruMin} - ${sirkaOtvoruMax}${lengthUnit}`;
vyskaOtvoruInput.placeholder = `${vyskaOtvoruMin} - ${vyskaOtvoruMax}${lengthUnit}`;

/**
 * Calculate type of door according width and height from input
 * 
 * @param {string} width 
 * @param {string} height 
 * @returns Type door: pri = privatni + evo | pru = prumyslova
 */

const setTypeDoor = (width, height) => {
    width = Number(width);
    height = Number(height);

    // if width > 4000mm (prumyslova)
    typeDoor01.disabled = width > 3999;

    // if width < 4000mm (privatni)
    typeDoor02.disabled = width < 4000;

    // if width > 3000mm || height > 3000mm (no evo)
    typeDoor03.disabled = (width > 3000 || height > 3000);

    checkTypeDoor();
    checkAccessoriesDoor();

    if (width < 4000) return 'pri'
    else return 'pru'
}

/**
 * Control input value for input 'Sirka otvoru' and 'Vyska otvoru'
 * 
 * @param {object} data
 * @param {number} min 
 * @param {number} max
 * 
 * @return Set / unset valid class for input, show / hide selected blocks configurator

*/
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

    let block01Arrow = hasClass(sirkaOtvoruInput, 'is-valid') && hasClass(vyskaOtvoruInput, 'is-valid');

    //setTimeout(() => {
        setTypeDoor(sirkaOtvoruInput.value, vyskaOtvoruInput.value);
    //}, 0);

    if (block01Arrow) {
        generateDriveDoors();
        generateColorDoor(setTypeDoor(sirkaOtvoruInput.value, vyskaOtvoruInput.value));
        choiceDrive();
        
        block01.classList.add('block-correct');
        block02.classList.remove('hidden');
        block03.classList.remove('hidden');
    } else {
        block01.classList.remove('block-correct');
        block02.classList.add('hidden');
        block03.classList.add('hidden');
    }
}

sirkaOtvoruInput.addEventListener('input', (data) => controlInputValue(data, sirkaOtvoruMin, sirkaOtvoruMax));
vyskaOtvoruInput.addEventListener('input', (data) => controlInputValue(data, vyskaOtvoruMin, vyskaOtvoruMax));


/** 
 * Check selection type of door
 */

const checkTypeDoor = () => {
    document.querySelectorAll('.custom-radio-type-door').forEach(el => {
        if (el.children[0].checked && el.children[0].disabled) {
            el.children[0].checked = false;   
        }
    })
}

/**
 * Generate color for selected type doors
 * 
 * @param {string} type 
 * 
 * @return Create options for listbox (colors) + show info text (about colors)
 */
const generateColorDoor = (type) => {
    const colorDoor = document.getElementById('color-door');

    let excludeColors = type == 'pri' ? [''] : ['modra', 'antracitova'];
    let colorDoorArrayFilter = colorDoorArray.filter( item => excludeColors.indexOf(item.value) == -1 );

    colorDoor.innerHTML = '';

    // for (let i of colorDoorArrayFilter) {

    // }
    for (let j = 0; j < colorDoorArrayFilter.length; j++) {
        let opt = document.createElement('option');
        opt.value = colorDoorArrayFilter[j].value;
        opt.innerHTML = colorDoorArrayFilter[j].name;
        colorDoor.appendChild(opt);
    }

    let suffix;

    switch(colorDoorArrayFilter.length) {
        case 1:
            suffix = 'barva';
            break;
        case 2:
        case 3:
        case 4: 
            suffix = 'barvy';
            break;
        default:
            suffix = 'barev';
    }

    document.getElementById('color-door-amount').innerHTML = `${colorDoorArrayFilter.length} ${suffix}`;   
}

/**
 * Generate list of drive doors
 */
const generateDriveDoors = () => {

    let listDrive = '';
    driveDoorArray.forEach( el => {
        listDrive += `
            <div class="custom-control custom-radio mb-2">
                <input type="radio" id="drive-door-${el.id}" name="drive-door" class="custom-control-input input-radio-drive">
                <label class="custom-control-label" for="drive-door-${el.id}">${el.type} ${el.power}${el.info}</label>
            </div>`
    });

    document.getElementById('drive-door').innerHTML = listDrive;
}

/**
 * Change drive of door
 */

const accessoriesDoor = document.getElementById('accessories-door');
const accessoriesDoor04 = document.getElementById('accessories-door-04');

function choiceDrive() {
    document.querySelectorAll('.input-radio-drive').forEach(element => {
        element.addEventListener('change', function() {

            const driveDoor01 = this.id === 'drive-door-106' && this.checked;
            const driveDoor05 = this.id === 'drive-door-42' && this.checked;

            driveDoor01 ? accessoriesDoor.classList.add('opacity-50') : accessoriesDoor.classList.remove('opacity-50');

            accessoriesDoor04.checked = driveDoor05;
            accessoriesDoor04.disabled = driveDoor05;
        })
    });
}

/** 
 * Check selection type of door
 */

const checkAccessoriesDoor = () => {
    document.getElementsByName('accessories-door').forEach(el => {
        el.checked = false;   
    })
}

/**
 * Disabled type if drive according type door
 */
document.querySelectorAll('.custom-radio-type-door').forEach( element => {
    element.addEventListener('change', function() {
        const typeDoorId = element.children[0].id;

        driveDoorArray.forEach( item => {

            // disabled: power > 900
            if (typeDoorId === 'type-door-01') {
                document.getElementById(`drive-door-${item.id}`).disabled = 
                    (typeof item.power === 'number' && item.power > 900) ? true : false;
            } 
            // disabled: power <= 800
            else if (typeDoorId === 'type-door-02') {
                document.getElementById(`drive-door-${item.id}`).disabled = 
                    (typeof item.power === 'number' && item.power <= 800) ? true : false;
            } 
            // disabled: power != 500 || 800
            else {
                document.getElementById(`drive-door-${item.id}`).disabled = 
                    (typeof item.power === 'number') ? 
                        ((item.power === 500 || item.power === 850) ? false : true) 
                    : false;    
            }
        })
    })
});