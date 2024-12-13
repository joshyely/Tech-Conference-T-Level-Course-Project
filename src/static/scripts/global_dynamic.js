const CHANGE_BTNS = Array.from(document.querySelectorAll('.change-btn'));
const CHANGE_BTN_ACTIVE = 'change-btn-text-active';
CHANGE_BTNS.forEach(btn => {
    btn.addEventListener('click', ()=>{
        let activeText = btn.querySelector(`.${CHANGE_BTN_ACTIVE}`);
        activeText.classList.remove(CHANGE_BTN_ACTIVE);
        if (activeText.nextElementSibling === null)
        {
            btn.firstElementChild.classList.add(CHANGE_BTN_ACTIVE);
        }
        else
        {
            activeText.nextElementSibling.classList.add(CHANGE_BTN_ACTIVE);
        }
    })
});


const COLLAPSE_BTNS = Array.from(document.querySelectorAll('.collapse-btn'));
COLLAPSE_BTNS.forEach(btn => {
    
    let targetID = btn.getAttribute('data-bs-target');
    let target = document.querySelector(targetID);
    btn.addEventListener('click', ()=>{
        Array.from(target.querySelectorAll('.was-validated'))
        .forEach(elem => {
            elem.classList.remove('was-validated');
            elem.querySelector('.invalid-feedback').innerHTML = '';
            let input = elem.querySelector('.form-control');
            input.setCustomValidity('');
            input.value = '';
        });
    })
    
});