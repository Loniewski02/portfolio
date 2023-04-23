const projectsBoxes = document.querySelector('.projects__boxes');

fetch('data.json')
	.then(response => response.json())
	.then(data => {
		for (let i = 0; i < data.length; i++) {
			projectsBoxes.innerHTML += `
			<div class="projects__box">
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
	})
	.catch(error => console.error(error));

const checkWidth = (data, i) => {
	if (window.innerWidth < 768) {
		return data[i].pathSmall;
	}

	if (window.innerWidth >= 768) {
		return data[i].pathLarge;
	}
};
