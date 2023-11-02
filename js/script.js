const form = document.querySelector('form');
const otherJobInput = document.querySelector('#other-job-role');
const jobSelect = document.querySelector("#title");
const colorMenu = document.querySelector("#color");
const colorLabel = colorMenu.parentElement;
const designMenu = document.querySelector('#design');
const totalP = document.querySelector("#activities-cost");
const activitiesField = document.querySelector('#activities');
const payment = document.querySelector('#payment');
const ccDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');
const allCheckboxes = document.querySelectorAll("input[type='checkbox']");


// On page load, focus on first input field
const nameInput = document.querySelector('input[type=text]');
nameInput.focus();

// Hide 'Other' job text input until needed
otherJobInput.style.display = 'none';

// Hide color menu until user chooses a design
colorMenu.style.display = 'none';
colorLabel.style.display = 'none';

// Set default payment to credit card, hide other payment info
payment.value = 'credit-card';
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';

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
    colorMenu.style.display = 'block';
    colorLabel.style.display = 'block';

    if (e.target.value === 'js puns'){
        updateColorOpts(heartJS, jsPuns)
        
    } else {
        updateColorOpts(jsPuns, heartJS);
    }

    // Takes design options to show/hide available colors
    function updateColorOpts(design1, design2) {
        design1.forEach(element => {
            element.style.display = 'none';
        });
        design2.forEach(element => {
            element.style.display = 'block';
        });
    }

})

// Updates Total shown on page as user selects different activities
let totalCost = 0;
activitiesField.addEventListener('change', (e) => {

    // If previously 'checked', then subtract the activity cost from total
    if (e.target.className === 'checked'){
        totalCost -= parseInt(e.target.getAttribute('data-cost'));
        e.target.className = '';
    }

    // If activity checked, then add activity cost to total and assign '.checked'
    if (e.target.checked === true){
       totalCost += parseInt(e.target.getAttribute('data-cost'));
       e.target.className = 'checked';
    } 

    // Update Total shown on page
    let text = `Total: $${totalCost}`;
    document.querySelector('#activities-cost').textContent = text;
})

payment.addEventListener('change', () => {

    if (payment.value === 'credit-card'){
        updateDisplay(ccDiv, paypalDiv, bitcoinDiv);
    } else if (payment.value === 'paypal'){
        updateDisplay(paypalDiv, ccDiv, bitcoinDiv);
    } else if (payment.value === 'bitcoin'){
        updateDisplay(bitcoinDiv, paypalDiv, ccDiv);
    }

    // Show/Hide relevant payments
    function updateDisplay(showDiv, hide1, hide2){
        showDiv.style.display = 'block';
        hide1.style.display = 'none';
        hide2.style.display = 'none';
    };
})



// Form Validation on Submit
form.addEventListener('submit', (e) => {
    // Variables declared/initialized
    const ccMethodSelected = payment.value === 'credit-card';
    const emailInput = document.querySelector('#email');
    const ccInput = document.querySelector('#cc-num');
    const zipInput = document.querySelector('#zip');
    const cvvInput = document.querySelector('#cvv');

    // Validation functions
    const isRegistered = () => document.querySelectorAll('.checked').length >= 1;
    const isValidName = () => /^(\s)*?[A-Za-z-]+(\s)*?[A-Za-z-]*(\s)*?$/.test(nameInput.value);
    const isValidEmail = () => /^[^@]+@[^@.]+\.[a-z]+$/i.test(emailInput.value);
    const isValidCC = () => /^\d{13,16}$/.test(ccInput.value);
    const isValidZip = () => /^\d{5}$/.test(zipInput.value);
    const isValidCVV = () => /^\d{3}$/.test(cvvInput.value);

    const checkValidation = (validation, element) => {
        if(!validation){
            element.closest('label').classList.add('not-valid');
            element.closest('label').classList.remove('valid');
        } else {
            element.closest('label').classList.remove('not-valid');
            element.closest('label').classList.add('valid');
        }
    }

    // If any invalid values exist for required fields, then prevent page refresh on submit
    if (!isValidName() ||
        !isValidEmail()||
        !isValidCC() ||
        !isValidZip() ||
        !isValidCVV() ||
        !isRegistered()
    ){
        e.preventDefault();
    }

    // 'Name' validation
    checkValidation(isValidName(), nameInput);

    // 'Email' validation
    checkValidation(isValidEmail(), emailInput);

    // 'Register for Activities' validation, user needs to select at least ONE
    const activities = document.querySelector('#activities');
    if (!isRegistered()) {
        activities.classList.remove('valid');
        activities.classList.add('not-valid');
    } else {
        activities.classList.remove('not-valid');
        activities.classList.add('valid');
    }

    // 'Credit Card' validation, IF credit card payment method is chosen
    if (ccMethodSelected) {
        // 'Credit Card number' validation
        checkValidation(isValidCC(), ccInput);

        // 'Zip code' validation
        checkValidation(isValidZip(), zipInput);
        
        // 'CVV' validation
        checkValidation(isValidCVV(), cvvInput);
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