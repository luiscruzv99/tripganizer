interface DragOptions {
	onmove?: (x: number, y: number) => void;
	ondrop?: () => void;
}

export function draggable(node: HTMLElement, options: DragOptions = {}) {
	let offsetX = 0;
	let offsetY = 0;

	function handleMousedown(event: MouseEvent) {
		event.preventDefault();
		const rect = node.getBoundingClientRect();
		offsetX = event.clientX - rect.left;
		offsetY = event.clientY - rect.top;

		document.addEventListener('mousemove', handleMousemove);
		document.addEventListener('mouseup', handleMouseup);
	}

	function handleMousemove(event: MouseEvent) {
		const x = event.clientX - offsetX;
		const y = event.clientY - offsetY;

		options.onmove?.(x, y);
	}

	function handleMouseup() {
		options.ondrop?.();
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
