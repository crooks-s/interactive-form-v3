/***
    Instructions 2:
    -Focus on first text input field
***/
const form = document.querySelector('form');
const emailInput = document.querySelector('#email');
const nameInput = document.querySelector('input[type=text]');
nameInput.focus();


/***
    Instructions 3:
    -Initially hide other-job-role text input
    -addEventListener to "Job Role" <select> for 'change', on 'change' display/hide the text input
***/ 
const otherJobInput = document.querySelector('#other-job-role');
const jobSelect = document.querySelector("#title");
otherJobInput.style.display = 'none';

jobSelect.addEventListener('change', (e) => {
    if (e.target.value === 'other'){
        otherJobInput.style.display = 'block';
    } else {
        otherJobInput.style.display = 'none';
    }
})


/***
    Instructions 4:
    -disable color <select>
    -set up design <select> to listen for 'change' --> when change detected --> color <select> enabled --> color <select> displays available color
    -not: color dropdown should display only the color options associated with the selected design
***/
const colorMenu = document.querySelector("#color");
const colorLabel = colorMenu.parentElement;
const designMenu = document.querySelector('#design');
colorMenu.style.display = 'none';
colorLabel.style.display = 'none';

designMenu.addEventListener('change', (e) => {
    const heartJS = colorMenu.querySelectorAll('[data-theme="heart js"]');
    const jsPuns = colorMenu.querySelectorAll('[data-theme="js puns"]');

    // reset colorMenu to default state when user changes design option
    colorMenu.querySelector('option').selected = true;
    colorMenu.style.display = 'block';
    colorLabel.style.display = 'block';

    if (e.target.value === 'js puns'){
        updateColorOpts(heartJS, jsPuns)
        
    } else {
        updateColorOpts(jsPuns, heartJS);
    }

    function updateColorOpts(styleOne, styleTwo) {
        styleOne.forEach(element => {
            element.style.display = 'none';
        });
        styleTwo.forEach(element => {
            element.style.display = 'block';
        });
    }

})

/***
    Instructions 5:
    -Total <p> should update to reflect total cost of selected activities
    -addEventListener to "Register for Activities" fieldset to listen for 'changes -->
      *if activity 'checked' Total should increase by [data-cost] of the <input type='checkbox'>.
      *if acvitity 'unchecked' Total should decrease by that amount
    -(<p> of #activity-cost)THIS IS THE TOTAL should update to reflect adjustments made    
***/

const totalP = document.querySelector("#activities-cost");
const activitiesField = document.querySelector('#activities');
let totalCost = 0;

activitiesField.addEventListener('change', (e) => {

    // if previously 'checked', then subtract the activity cost from total
    if (e.target.className === 'checked'){
        totalCost -= parseInt(e.target.getAttribute('data-cost'));
        e.target.className = '';
    }

    // if activity checked, then add activity cost to total and assign a 'checked' class
    if (e.target.checked === true){
       totalCost += parseInt(e.target.getAttribute('data-cost'));
       e.target.className = 'checked';
    } 

    // update Total shown on page
    let text = `Total: $${totalCost}`;
    document.querySelector('#activities-cost').textContent = text;
})


/***
    Instructions 6:
    -CC should be default option selected
    -CC payment section should be only section displayed
    -when user selects different method from drop-down, form should update display to only that method
***/

const payment = document.querySelector('#payment');
const ccDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');

// set default payment to credit card, hide other payment info
payment.value = 'credit-card';
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';

payment.addEventListener('change', () => {

    if (payment.value === 'credit-card'){
        updateDisplay(ccDiv, paypalDiv, bitcoinDiv);
    } else if (payment.value === 'paypal'){
        updateDisplay(paypalDiv, ccDiv, bitcoinDiv);
    } else if (payment.value === 'bitcoin'){
        updateDisplay(bitcoinDiv, paypalDiv, ccDiv);
    }

    // show/hide relevant divs
    function updateDisplay(showDiv, hide1, hide2){
        showDiv.style.display = 'block';
        hide1.style.display = 'none';
        hide2.style.display = 'none';
    };
})


/***
    Instructions 7:
    -addEventListener on form for 'submit' --> validate each required form field/section
    -if invalid, form submission should be prevented (**use e.preventDefault()**)
    @name cannot be blank or empty
    @email address needs to be formatted using @ and '.'
    @register for activities must have at least one activity selected
    @IF AND ONLY IF cc method is selected
        -cc must contain 13-16 digits without dashes or spaces
        -zip code must be 5 digit number
        -cvv must be 3 digit number
***/

const isValidName = () => /^(\s)*?[A-Za-z-]+(\s)*?[A-Za-z-]*(\s)*?$/.test(nameInput.value);
const isValidEmail = () => /^[^@]+@[^@.]+\.[a-z]+$/i.test(emailInput.value);
const registered = () => document.querySelectorAll('.checked').length >= 1;
const ccMethodSelected = payment.value === 'credit-card';

form.addEventListener('submit', (e) => {
    if ( !isValidName() ) {
        e.preventDefault();
        // console.log('whoa there'); alert user about format
    }
})

if (ccMethodSelected) {
    // do something
}