// Global DOM variables
const form = document.querySelector('form');
const otherJobInput = document.querySelector('#other-job-role');
const colorMenu = document.querySelector("#color");
const designMenu = document.querySelector('#design');
const payment = document.querySelector('#payment');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');
const allCheckboxes = document.querySelectorAll("input[type='checkbox']");
const activities = document.querySelector('#activities');

// Validate if user registered for at least one activity
const isRegistered = () => document.querySelectorAll('.checked').length >= 1;

// Validate name
const nameInput = document.querySelector('input[type=text]');
const isValidName = () => /^(\s)*?[A-Za-z-]+(\s)*?[A-Za-z-]*(\s)*?$/.test(nameInput.value);

// Validate email
const emailInput = document.querySelector('#email');
const isValidEmail = () => /^[^@]+@[^@.]+\.[a-z]+$/i.test(emailInput.value);

// Validate credit card
const ccInput = document.querySelector('#cc-num');
const isValidCC = () => /^\d{13,16}$/.test(ccInput.value);

// Validate zip code
const zipInput = document.querySelector('#zip');
const isValidZip = () => /^\d{5}$/.test(zipInput.value);

// Validate CVV
const cvvInput = document.querySelector('#cvv');
const isValidCVV = () => /^\d{3}$/.test(cvvInput.value);


/**
 * Uses validation functions above to modify selected HTML element
 * @param {function} valid - validation function
 * @param {DOM element} element - HTML element to modify
 * @param {string} ancestor - parent/ancestor to target
 * @param {string} field - hint element to be shown/hidden
 */
const checkValidation = (valid, element, ancestor, field) => {
    if(!valid){
        element.closest(ancestor).classList.add('not-valid');
        element.closest(ancestor).classList.remove('valid');

        // If hint element is span, style 'inline'; 
        if (document.querySelector(`#${field}-hint`).tagName === 'SPAN'){
            document.querySelector(`#${field}-hint`).style.display = 'inline';
        // else style 'block' due to hint in checkbox fieldset being a paragraph element
        } else {
            document.querySelector(`#${field}-hint`).style.display = 'block';
        }
    } else { // is valid
        element.closest(ancestor).classList.remove('not-valid');
        element.closest(ancestor).classList.add('valid');
        document.querySelector(`#${field}-hint`).style.display = 'none';
    }
}


// On page load, focus on first input field
nameInput.focus();

// Hide 'Other' job text input until needed
otherJobInput.style.display = 'none';

// Disable color menu until user chooses a design
colorMenu.disabled = true;

// Set default payment to credit card, hide other payment info
payment.value = 'credit-card';
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';

const jobSelect = document.querySelector("#title");
// If 'Other' job selected, then show relevant text input
jobSelect.addEventListener('change', (e) => {
    if (e.target.value === 'other'){
        otherJobInput.style.display = 'block';
    } else {
        otherJobInput.style.display = 'none';
    }
})

// Show/hide relevant color menu for selected design
designMenu.addEventListener('change', (e) => {
    const heartJS = colorMenu.querySelectorAll('[data-theme="heart js"]');
    const jsPuns = colorMenu.querySelectorAll('[data-theme="js puns"]');

    // Reset colorMenu to default state when user changes design option
    colorMenu.querySelector('option').selected = true;
    colorMenu.disabled = true;

    // Update color options per selected design
    if (e.target.value === 'js puns'){
        updateColorOpts(heartJS, jsPuns)        
    } else {
        updateColorOpts(jsPuns, heartJS);
    }

    // Takes design options to show/hide available colors and enable color menu
    function updateColorOpts(design1, design2) {
        colorMenu.disabled = false;
        design1.forEach(element => {
            element.style.display = 'none';
        });
        design2.forEach(element => {
            element.style.display = 'block';
        });
    }

})

// Handles changes needed upon checkbox selections
// Updates Total shown on page as user selects different activities
let totalCost = 0;
const activitiesField = document.querySelector('#activities');
activitiesField.addEventListener('change', (e) => {

    // If previously 'checked', then ...
    if (e.target.className === 'checked'){

        // ... reverse changes on checkboxes to allow re-selection
        for (const checkbox of allCheckboxes) {
            const selectedBox = document.querySelectorAll('.checked');
            for (const selected of selectedBox) {
                if ( checkbox.getAttribute('data-day-and-time') === selected.getAttribute('data-day-and-time') &&
                (checkbox !== selected)
                ) {
                    checkbox.disabled = false;
                }
            }
        }

        // ... subtract activity cost from total
        totalCost -= parseInt(e.target.getAttribute('data-cost'));
        e.target.className = '';
    }

    // If activity checked, then add activity cost to total and assign '.checked'
    if (e.target.checked === true){
       totalCost += parseInt(e.target.getAttribute('data-cost'));
       e.target.className = 'checked';
    } 

    // Update Total $ amount shown on page
    let text = `Total: $${totalCost}`;
    document.querySelector('#activities-cost').textContent = text;

    // Disable checkboxes with conflicting day/time of selected checkbox
    for (const checkbox of allCheckboxes) {
        const selectedBox = document.querySelectorAll('.checked');
        for (const selected of selectedBox) {
            if ( checkbox.getAttribute('data-day-and-time') === selected.getAttribute('data-day-and-time') &&
            (checkbox !== selected)
            ) {
                checkbox.disabled = true;
            }
        }
    }

    // Check validation on each checkbox change to show/hide hint if user has not selected at least one activity
    checkValidation(isRegistered(), activities, 'fieldset', 'activities');

})

// Handles payment info when user 'changes' payment method
payment.addEventListener('change', () => {
    const ccDiv = document.querySelector('#credit-card');

    // Update relevant info for selected payment method
    if (payment.value === 'credit-card'){
        updateDisplay(ccDiv, paypalDiv, bitcoinDiv);
    } else if (payment.value === 'paypal'){
        updateDisplay(paypalDiv, ccDiv, bitcoinDiv);
    } else if (payment.value === 'bitcoin'){
        updateDisplay(bitcoinDiv, paypalDiv, ccDiv);
    }

    // Show/Hide relevant payments info
    function updateDisplay(showDiv, hide1, hide2){
        showDiv.style.display = 'block';
        hide1.style.display = 'none';
        hide2.style.display = 'none';
    };
})

// Form Validation on Submit
form.addEventListener('submit', (e) => {
    const ccMethodSelected = payment.value === 'credit-card';

    // If any invalid values exist for required fields, then prevent form submission
    if (!isValidName() ||
        !isValidEmail() ||
        !isRegistered()
    ){
        e.preventDefault();
    }

    // 'Name' validation
    checkValidation(isValidName(), nameInput, 'label', 'name');

    // 'Email' validation
    checkValidation(isValidEmail(), emailInput, 'label', 'email');

    // 'Register for Activities' validation, user needs to select at least ONE
    checkValidation(isRegistered(), activities, 'fieldset', 'activities');

    // 'Credit Card' validation, IF credit card payment method is chosen
    if (ccMethodSelected) {

        // If invalid credit card values, then prevent form submission
        if (!isValidCC() ||
            !isValidZip() ||
            !isValidCVV() 
        ){
            e.preventDefault();
        }

        // 'Credit Card number' validation
        checkValidation(isValidCC(), ccInput, 'label', 'cc');

        // 'Zip code' validation
        checkValidation(isValidZip(), zipInput, 'label', 'zip');
        
        // 'CVV' validation
        checkValidation(isValidCVV(), cvvInput, 'label', 'cvv');
    }

})

// Form Validation, real-time errors for user upon 'keyup'
form.addEventListener('keyup', (e) => {
    const ccMethodSelected = payment.value === 'credit-card';

    checkValidation(isValidName(), nameInput, 'label', 'name');
    checkValidation(isValidEmail(), emailInput, 'label', 'email');
    if (ccMethodSelected) {
        if (!isValidCC() ||
            !isValidZip() ||
            !isValidCVV() 
        ){
            e.preventDefault();
        }
        checkValidation(isValidCC(), ccInput, 'label', 'cc');
        checkValidation(isValidZip(), zipInput, 'label', 'zip');
        checkValidation(isValidCVV(), cvvInput, 'label', 'cvv');
    }
})

// Accessibility: add focus states to checkboxes for tab targeting 
for (let i=0; i<allCheckboxes.length; i++) {
    allCheckboxes[i].addEventListener('focus', (e) => {
        e.target.closest('label').className = 'focus';
    })

    allCheckboxes[i].addEventListener('blur', (e) => {
        document.querySelector('.focus').className = '';
    })
}