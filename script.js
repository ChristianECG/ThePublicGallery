const $clear = document.getElementById('clear');
const $save = document.getElementById('save');

const $canvas = document.getElementById('canvas');
const ctx = $canvas.getContext('2d');
const pos = { x: 0, y: 0 };

const setPosition = (e) => {
	const rect = $canvas.getBoundingClientRect();
	pos.x = e.clientX - rect.left;
	pos.y = e.clientY - rect.top;
};

const draw = (e) => {
	if (e.buttons !== 1) return;

	const color = document.getElementById('color').value;

	ctx.beginPath();

	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.strokeStyle = color;

	ctx.moveTo(pos.x, pos.y);
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

document.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

clear.addEventListener('click', clearCanvas);
save.addEventListener('click', saveCanvas);
