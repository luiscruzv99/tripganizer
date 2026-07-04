interface DragOptions {
	onmove?: (x: number, y: number) => void;
}

export function draggable(node: HTMLElement, options: DragOptions = {}) {
	let offsetX = 0;
	let offsetY = 0;
	let currentX = 0;
	let currentY = 0;

	function handleMousedown(event: MouseEvent) {
		event.preventDefault();
		const rect = node.getBoundingClientRect();
		offsetX = event.clientX - rect.left;
		offsetY = event.clientY - rect.top;

		document.addEventListener('mousemove', handleMousemove);
		document.addEventListener('mouseup', handleMouseup);
	}

	function handleMousemove(event: MouseEvent) {
		currentX = event.clientX - offsetX;
		currentY = event.clientY - offsetY;

		node.style.transform = `translate(${currentX}px, ${currentY}px)`;

		options.onmove?.(currentX, currentY);
	}

	function handleMouseup() {
		document.removeEventListener('mousemove', handleMousemove);
		document.removeEventListener('mouseup', handleMouseup);
	}

	node.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
			document.removeEventListener('mousemove', handleMousemove);
			document.removeEventListener('mouseup', handleMouseup);
		}
	};
}
