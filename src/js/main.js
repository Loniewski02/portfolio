let form;
let nameInput;
let emailInput;
let msgTextarea;
let allInputs;
let sendBtn;
let backBtn;

const projectsBoxes = document.querySelector('.projects__boxes');
let aosPosition;
const URL = 'data.json';
const reLetters = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]*$/;

const emailjsConfig = {
	service_id: 'service_18oof3o',
	template_id: 'template_cnc9mcc',
	user_id: 'rwtceOKfbHrv4W1Ff',
};

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
	handleData();
};

const prepareDOMElements = () => {
	form = document.querySelector('.footer__contact-form');
	nameInput = form.querySelector('#name');
	emailInput = form.querySelector('#email');
	msgTextarea = form.querySelector('#msg');
	allInputs = form.querySelectorAll('input, textarea');
	sendBtn = document.querySelector('.send-btn');
	backBtn = document.querySelector('.back-btn');
};

const prepareDOMEvents = () => {
	window.addEventListener('scroll', handleBackBtn);
	sendBtn.addEventListener('click', e => {
		e.preventDefault();
		contactMain();
	});

	handleKeyup(nameInput, checkName);
	handleKeyup(emailInput, checkMail);
	handleKeyup(msgTextarea, checkLength);

	nameInput.addEventListener('blur', () => {
		handleInputBlur(nameInput, checkName);
	});

	emailInput.addEventListener('blur', () => {
		handleInputBlur(emailInput, checkMail);
	});

	msgTextarea.addEventListener('blur', () => {
		handleInputBlur(msgTextarea, input => checkLength(input, 20));
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
};

function sendEmail() {
	const name = nameInput.value;
	const email = emailInput.value;
	const message = msgTextarea.value;

	emailjs
		.send(
			emailjsConfig.service_id,
			emailjsConfig.template_id,
			{
				from_name: name,
				from_email: email,
				message: message,
			},
			emailjsConfig.user_id
		)
		.then(
			function (response) {
				console.log(response);
				alert('The message was sent.');
			},
			function (error) {
				console.error(error);
				alert('Sorry, there was an error while sending the message.');
			}
		);
}

async function handleData() {
	const response = await axios.get(URL);
	try {
		createProjects(response.data);
	} catch (error) {
		console.error(error);
	}
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
			<img src="${data[i].imgPath}" alt="">
			<div class="projects__box-img-links">
			<a href="${data[i].live}" target="_blank" rel="noopener noreferrer" data-text="view project" class="projects__box-img-link">view project</a>
			<a href="${data[i].code}" target="_blank" rel="noopener noreferrer" data-text="view code" class="projects__box-img-link">view code</a>
			</div>
			</div>
			<h3 class="projects__box-title">${data[i].title}</h3>
			<p class="projects__box-built-with">${data[i].builtWith}</p>
			<div class="projects__box-links">
			<a href="${data[i].live}" target="_blank" rel="noopener noreferrer" data-text="view project" class="projects__box-link projects__box-link--first">view project</a>
			<a href="${data[i].code}" target="_blank" rel="noopener noreferrer" data-text="view code" class="projects__box-link">view code</a>
			</div>
			</div>`;
	}
};

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
	} else if (input.value.length < 1) {
		showError(input, `can't be blank`);
	} else {
		clearError(input);
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
		sendEmail();

		allInputs.forEach(input => {
			input.value = '';
			input.parentElement.classList.remove('footer__contact-form-box--error');
			input.parentElement.classList.remove('footer__contact-form-box--succes');
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

const handleBackBtn = () => {
	if (window.scrollY > 600) {
		backBtn.style.display = 'block';
	} else {
		backBtn.style.display = 'none';
	}
};

const handleKeyup = (field, validator) => {
	field.addEventListener('keyup', e => {
		if (e.key === 'Enter') {
			validator(field);
		}
	});
};

const handleInputBlur = (inputElement, checkFunction) => {
	if (inputElement.value !== '') {
		checkFunction(inputElement);
	} else {
		inputElement.parentElement.classList.remove('footer__contact-form-box--error');
		inputElement.parentElement.classList.remove('footer__contact-form-box--succes');
	}
};

document.addEventListener('DOMContentLoaded', main);
