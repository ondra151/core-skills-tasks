/* Javascript for Garage door configuration 
    =======
*/

console.log('Hello in building configurator :-)'); 

/**
 * Set variables
 */

const unitDoor = 'mm';

let widthDoor = 0;
let isWidthDoorCorrect = false;
let heightDoor = 0;
let isHeightDoorCorrect = false;
let typeDoor = '';
let driveDoor = '';
let colorDoor = '';
let accessoriesDoor = new Set();

/**
 * Elements
 */
const widthDoorInput = document.getElementById('input-width');
const heightDoorInput = document.getElementById('input-height');

const typeDoorRadio = Array.from(document.getElementsByName('type-door'));
const driveDoorRadio = document.getElementsByName('drive-door');
const colorDoorSelect = document.getElementById('color-door');
const colorDoorAmount = document.getElementById('color-door-amount');
const accessoriesDoorBlock = document.getElementById('accessories-door');
const accessoriesDoorCheckbox = Array.from(document.getElementsByName('accessories-door'));
//const accessoriesDoorCheckbox = [...document.getElementsByName('accessories-door')];

/**
 *  Helper function 
 */
let addClass = (item, state) => item.classList.add(state ? 'is-valid' : 'is-invalid');


let removeClass = (item, state) => item.classList.remove(state ? 'is-valid' : 'is-invalid'); 

let toggleClass = (item, className) => item.classList.toggle(className);

let hasClass = (item, className) => item.classList.contains(className);

let renderValidityClass = (element, isValid) => {
    element.classList.toggle('is-valid', isValid);
    element.classList.toggle('is-invalid', !isValid);
} 

// ----------
// addEventListener

/**
 * Width addEventLister
 */
widthDoorInput.addEventListener('input', (data) => {

    let min = Number(data.target.min);
    let max = Number(data.target.max);
    let value = Number(data.target.value);

    setWidth(min, max, value);
    renderWidthValidity();
    renderBlocks();
});

/**
 * Height addEventListener
 */
heightDoorInput.addEventListener('input', (data) => {

    let min = Number(data.target.min);
    let max = Number(data.target.max);
    let value = Number(data.target.value);

    setHeight(min, max, value);
    renderHeightValidity();
    renderBlocks();
});

/**
 * Type Door addEventListener
 */
typeDoorRadio.forEach( el => {
    el.addEventListener('input', (event) => {
        let value = event.target.value;

        setTypeDoor(value);
        renderDriveDoor();
        renderColorDoor();
        renderBlock03();
    })
});

/**
 * Drive Door addEventListener
 */
driveDoorRadio.forEach (el => {
    el.addEventListener('input', (event) => {

        let drive = event.target.value

        setDriveDoor(drive);
        renderAccessoriesDoor();
    });
});

/**
 * Color Door addEventListener
 */
colorDoorSelect.addEventListener('change', (event) => {
    setColorDoor(event.target.value);
});


/**
 * Accessories Door addEventListener
 */
accessoriesDoorCheckbox.forEach( el => {
    el.addEventListener('input', (event) => {
        setAccessoriesDoor(event.target.value);
    })
})

// -----------
// Function

/**
 * Set width door
 * 
 * @param { number } min 
 * @param { number } max 
 * @param { number } value 
 */
const setWidth = (min, max, value) => {

    isWidthDoorCorrect = (value >= min) && (value <= max);
    widthDoor = value;
}

/**
 * Set height door
 * 
 * @param { number } min 
 * @param { number } max 
 * @param { number } value 
 */
const setHeight = (min, max, value) => {

    isHeightDoorCorrect = (value >= min) && (value <= max);
    heightDoor = value;
}

/**
 * Set type door
 * 
 * @param { string } value 
 */
const setTypeDoor = (value) => {
    typeDoor = value;
}

/**
 * Set drive door
 * 
 * @param { string } value 
 */
const setDriveDoor = (value) => {
    driveDoor = value;
}

/**
 * Set color door
 * 
 * @param { string } value 
 */
const setColorDoor = (value) => {
    colorDoor = value;
}

/**
 * Set accessories door
 * 
 * @param { string } value 
 */
const setAccessoriesDoor = (value) => {
    accessoriesDoor.has(value) ? accessoriesDoor.delete(value) : accessoriesDoor.add(value);
}


/**
 * Set disable item for drive door
 * 
 * @param { string } type 
 */
const renderDriveDoor = () => {
    driveDoorRadio.forEach( el => {
        let value = Number(el.value);

        if (typeDoor === 'pri') {
            el.disabled = value > 900;   
        } else if (typeDoor === 'pru') {
            el.disabled = value <= 800;
        } else if (typeDoor === 'evo') {
            el.disabled = (value > 0 && value !== 500) && (value > 0 && value !== 850);
        } else {
            el.disabled = false;    
        }

        if (el.checked && el.disabled) { 
            el.checked = false; 
        }
    });
}

/**
 * Set disable item for color door
 * 
 * @param { string } type 
 */
const renderColorDoor = () => {

    let amount = 0;
    let text = '';

    Object.values(colorDoorSelect.options).forEach (el => {
        el.disabled = (typeDoor === 'pru') ? (el.value === 'bila' || el.value === 'cervena') : false;

        if (!el.disabled) amount += 1;
    }); 

    switch(amount) {
        case 1:
            text = 'barva';
            break;
        case 2:
        case 3:
        case 4: 
            text = 'barvy';
            break;
        default: 
            text = 'barev';
    }
    
    colorDoorAmount.innerHTML = `${amount} ${text}`;
}

/**
 * Set disable item for accessories door
 * 
 */
const renderAccessoriesDoor = () => {
    let isDisabledBlock = accessoriesDoorBlock.classList.toggle('opacity-50', driveDoor === 'no');

    accessoriesDoorCheckbox.forEach (el => {

        el.disabled = isDisabledBlock; 

        if (isDisabledBlock) {
            el.checked = false;   
        }
    });

    // opravit gift
    let element = accessoriesDoorCheckbox.find(el => el.value === 'ovladac_navic');
    let isDriveWithGift = driveDoor === '1000';

    element.disabled = isDriveWithGift;

    if (isDriveWithGift) { 
        element.checked = true;
    }
}

/**
 * Checking the correctness of values
 * 
 */

const renderWidthValidity = () => {
    renderValidityClass(widthDoorInput, isWidthDoorCorrect);
}

const renderHeightValidity = () => {
    renderValidityClass(heightDoorInput, isHeightDoorCorrect);
}

/**
 * Render blocks (dimensions, type)
 * 
 */
// upravit
const renderBlocks = () => {
    if (isWidthDoorCorrect && isHeightDoorCorrect) {
        renderTypeDoor(widthDoor, heightDoor);
        toggleContentBlock('block-01', 'block-correct', true);
        toggleContentBlock('block-02', 'hidden', false);
    } else {
        toggleContentBlock('block-01', 'block-correct', false);
        toggleContentBlock('block-02', 'hidden', true);
    }
}

/**
 * Render next blocks (drive, color, accessories)
 * 
 */
const renderBlock03 = () => {
    toggleContentBlock('block-03', 'hidden', !typeDoor || !isWidthDoorCorrect || !isHeightDoorCorrect);    
}

/**
 * Disabled option for Type Door
 * 
 * @param { number } width 
 * @param { number} height 
 */

const renderTypeDoor = (width, height) => {

    // if width > 4000mm (prumyslova)
    document.getElementById('type-door-01').disabled = width > 3999;

    // if width < 4000mm (privatni)
    document.getElementById('type-door-02').disabled = width < 4000;

    // if width > 3000mm || height > 3000mm (no evo)
    document.getElementById('type-door-03').disabled = (width > 3000 || height > 3000);

    // Type Door
    let element = typeDoorRadio.find(el => el.checked && el.disabled);

    if (element) {
        element.checked = false;
        typeDoor = '';
        renderBlock03();   
    }
    
}


/**
 * Toggle class on selected elements
 * 
 * @param { string } blockClass 
 * @param { string } nameClass 
 * @param { boolean } state 
 * @return Add / remove class for selected elements 
 */
const toggleContentBlock = (blockClass, nameClass, state) => {
    return state ? document.getElementsByClassName(blockClass)[0].classList.add(nameClass) : document.getElementsByClassName(blockClass)[0].classList.remove(nameClass)
}