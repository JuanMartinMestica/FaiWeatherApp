let menu = document.querySelector('.bar');
let wrapper = document.querySelector('.wrapper');

menu.addEventListener('click', () => {

    menu.firstElementChild.classList.toggle('hide');
    menu.lastElementChild.classList.toggle('hide');
    wrapper.classList.toggle('active');
    document.body.classList.toggle('stop-scrolling');

});