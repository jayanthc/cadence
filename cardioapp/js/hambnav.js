const btn = document.getElementById('hambNav');
const nav = document.getElementById('navDrop');
let click = 0;

btn.addEventListener('click', function() {
	if(click == 0) {
		btn.children[0].src = 'imgs/exit_nav.png';
		nav.style.top = '0';
		nav.style.height = '100%';
		nav.style.overflow = 'visible';
		click = 1;
	} else {
		btn.children[0].src = 'imgs/hamb_nav.png';
		nav.style.top = '-100%';
		nav.style.height = '0';
		nav.style.overflow = 'hidden';
		click = 0;
	}
});