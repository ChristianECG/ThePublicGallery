const API_URL =
	'https://api.github.com/repos/ChristianECG/ThePublicGallery/contents/gallery';

const $clear = document.getElementById('clear');
const $save = document.getElementById('save');

const $canvas = document.getElementById('canvas');
const ctx = $canvas.getContext('2d');
const pos = { x: 0, y: 0 };

const setPosition = (e) => {
	const rect = $canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	if (x < 0 || x > $canvas.width || y < 0 || y > $canvas.height) return;

	pos.x = x;
	pos.y = y;
};

const draw = (e) => {
	if (e.buttons !== 1) return;

	const color = document.getElementById('color').value;

	ctx.beginPath();
	ctx.moveTo(pos.x, pos.y);

	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.strokeStyle = color;

	setPosition(e);
	ctx.lineTo(pos.x, pos.y);

	ctx.stroke();
	saveOnLocalStorage();
};

const clearCanvas = () => {
	ctx.clearRect(0, 0, $canvas.width, $canvas.height);
	clearLocalStorage();
};

const saveCanvas = () => {
	Swal.fire({
		title: 'Save your drawing',
		text: 'Enter your GitHub username to save your drawing, and make sure to save on the "gallery" folder.',
		input: 'text',
		showCancelButton: true,
		confirmButtonText: 'Save',
		showLoaderOnConfirm: true,
	}).then((result) => {
		if (!result.value) return;

		const username = result.value;

		const data = $canvas.toDataURL('image/png');
		const dataURL = data.replace(
			/^data:image\/png/,
			'data:application/octet-stream'
		);

		const link = document.createElement('a');
		link.download = `${username}.png`;
		link.href = dataURL;
		link.click();
	});
};

const saveOnLocalStorage = () => {
	const data = $canvas.toDataURL('image/png');
	localStorage.setItem('drawing', data);
};

const loadFromLocalStorage = () => {
	const data = localStorage.getItem('drawing');
	if (!data) return;

	const img = new Image();
	img.src = data;
	img.onload = () => ctx.drawImage(img, 0, 0);
};

const clearLocalStorage = () => {
	localStorage.removeItem('drawing');
};

const showGallery = async () => {
	const request = await fetch(API_URL);
	const data = await request.json();
	const $imagesContainer = document.getElementById('images');

	data.forEach((user) => {
		const username = user.name.slice(0, -4);
		const $img = `<div>
			<img src="gallery/${user.name}" alt="${username}" />
			<p>
				<a id="nombreGit" href="https://github.com/${username}" target="_blank">
					${username}
				</a>
			</p>
		</div>`;
		$imagesContainer.innerHTML += $img;
	});
	loadFromLocalStorage();
};

document.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

clear.addEventListener('click', clearCanvas);
save.addEventListener('click', saveCanvas);

document.addEventListener('DOMContentLoaded', showGallery);
