const form = document.querySelector('.footer__contact-form');
const nameInput = form.querySelector('#name');
const emailInput = form.querySelector('#email');
const msgTextarea = form.querySelector('#msg');
const allInputs = form.querySelectorAll('input, textarea');
const sendBtn = document.querySelector('.send-btn');

const projectsBoxes = document.querySelector('.projects__boxes');
let aosPosition;
const URL = 'data.json';
const regMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const reLetters = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]*$/;

async function handleData() {
	const response = await axios.get(URL);
	createProjects(response.data);
}

const createProjects = data => {
	for (let i = 0; i < data.length; i++) {
		if (i % 2 == 0) {
			aosPosition = 'right';
		} else {
			aosPosition = 'left';
		}

		projectsBoxes.innerHTML += `
			<div class="projects__box" data-aos="fade-down-${aosPosition}" data-aos-delay="100">
			<div class="projects__box-img">
			<img src="${checkWidth(data, i)}" alt="">
			<div class="projects__box-img-links">
			<a href="${data[i].live}" data-text="view project" class="projects__box-img-link">view project</a>
			<a href="${data[i].code}" data-text="view code" class="projects__box-img-link">view code</a>
			</div>
			</div>
			<h3 class="projects__box-title">${data[i].title}</h3>
			<p class="projects__box-built-with">${data[i].builtWith}</p>
			<div class="projects__box-links">
			<a href="${data[i].live}" data-text="view project" class="projects__box-link projects__box-link--first">view project</a>
			<a href="${data[i].code}" data-text="view code" class="projects__box-link">view code</a>
			</div>
			</div>`;
	}
};

const checkWidth = (data, i) => {
	if (window.innerWidth < 768) {
		return data[i].pathSmall;
	}

	if (window.innerWidth >= 768) {
		return data[i].pathLarge;
	}
};

handleData();

const showError = (input, msg) => {
	const formBox = input.parentElement;
	const errorIco = formBox.querySelector('.error-ico');
	const errorMsg = formBox.querySelector('.error-info');
	formBox.classList.add('footer__contact-form-box--error');
	errorMsg.textContent = msg;
	errorIco.classList.add('shake');

	setTimeout(() => {
		errorIco.classList.remove('shake');
	}, 500);
};

const clearError = input => {
	const formBox = input.parentElement;
	formBox.classList.remove('footer__contact-form-box--error');
	formBox.classList.add('footer__contact-form-box--succes');
};

const checkForm = input => {
	input.forEach(el => {
		if (el.value === '') {
			showError(el, `can't be blank!`);
		} else {
			clearError(el);
		}
	});
};

const checkLength = (input, min) => {
	if (input.value.length < min && input.value.length > 0) {
		showError(input, `${input.previousElementSibling.textContent} should consist of at least ${min} characters`);
	}
};

const checkName = input => {
	if (input.value.length < 1) {
		showError(input, `can't be blank`);
	} else {
		if (!input.value === reLetters.test(input.value)) {
			showError(input, 'ooops! Wrong format, letters only');
		} else {
			clearError(input);
		}
		checkLength(input, 3);
	}
};

const checkMail = input => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
	if (input.value.length < 1) {
		showError(input, `can't be blank`);
	} else {
		if (re.test(input.value)) {
			clearError(input);
		} else {
			showError(input, `ooops! That doesn't look like an email addres`);
		}
	}
};

const checkErrors = () => {
	const formBoxes = document.querySelectorAll('.footer__contact-form-box');
	let errorCount = 0;

	formBoxes.forEach(el => {
		if (el.classList.contains('footer__contact-form-box--error')) {
			errorCount++;
		}
	});

	if (errorCount === 0) {
		allInputs.forEach(input => {
			input.value = '';
			clearError(input);
		});
	}
};

const contactMain = () => {
	checkForm(allInputs);
	checkName(nameInput);
	checkLength(msgTextarea, 20);
	checkMail(emailInput);
	checkErrors();
};

sendBtn.addEventListener('click', contactMain);

nameInput.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		checkName(nameInput, 3);
	}
});

emailInput.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		checkMail(emailInput);
	}
});

allInputs.forEach(el => {
	el.addEventListener('focus', e => {
		let parent = el.parentElement;
		parent.classList.add('footer__contact-form-box--active');
	});

	el.addEventListener('blur', e => {
		let parent = el.parentElement;
		parent.classList.remove('footer__contact-form-box--active');
	});
});
