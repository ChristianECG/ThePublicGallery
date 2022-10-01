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
};

const clearCanvas = () => ctx.clearRect(0, 0, $canvas.width, $canvas.height);

const saveCanvas = () => {
	Swal.fire({
		title: 'Save your drawing',
		text: 'Enter your GitHub username to save your drawing, and make sure to save on the "gallery" folder.',
		input: 'text',
		inputAttributes: {
			autocapitalize: 'off',
		},
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

const showGallery = () => {
	const mockedData = [{ name: 'ChristianECG.png' }];
	const $imagesContainer = document.getElementById('images');

	mockedData.forEach((user) => {
		const username = user.name.slice(0, -4);
		const $img = `<div>
			<img src="gallery/${user.name}" alt="${username}" />
			<p>
				<a href="https://github.com/${username}" target="_blank">
					${username}
				</a>
			</p>
		</div>`;
		$imagesContainer.innerHTML += $img;
	});
};

document.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

clear.addEventListener('click', clearCanvas);
save.addEventListener('click', saveCanvas);

showGallery();
