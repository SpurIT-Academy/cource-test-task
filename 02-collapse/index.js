const SELECTORS = {
	COLLAPSE: '.collapsible',
	BUTTON: '.collapsible__button',
	SHOW_TEXT: '.collapsible__action--hidden',
	HIDE_TEXT: '.collapsible__action--visible',
	CONTENT: '.collapsible__content'
};

const STATES = {
	EXPANDED: 'expanded',
	ANIMATED: 'animated',
	COLLAPSED: 'collapsed',
};

const ANIMATION_CONFIG = {
	duration: 1000,
	easing: 'ease-out',
	fill: 'forwards'
};

class Collapse {
	constructor(node) {
		this.element = node;
		this.button = this.element.querySelector(SELECTORS.BUTTON);
		this.showText = this.button.querySelector(SELECTORS.SHOW_TEXT);
		this.showText.hidden = true;
		this.hideText = this.button.querySelector(SELECTORS.HIDE_TEXT);
		this.content = this.element.querySelector(SELECTORS.CONTENT);
		this.content.style.overflow = 'hidden';

		this.animation = null;
		this.state = STATES.EXPANDED;

		this.button.addEventListener('click', this.toggle.bind(this));
	}

	toggle() {
		switch (this.state) {
			case STATES.COLLAPSED:
				this.expand();
				break;
			case STATES.EXPANDED:
				this.collapse();
				break;
			default:
				return;
		}
	}

	collapse() {
		this.state = STATES.ANIMATED;
		// requestAnimationFrame(this._animateContent(false, STATES.COLLAPSED));
		this._animateContent(false, STATES.COLLAPSED);
	}

	expand() {
		this.state = STATES.ANIMATED;
		// requestAnimationFrame(this._animateContent(true, STATES.EXPANDED));
		this._animateContent(true, STATES.EXPANDED);
	}

	_animateContent(reverse, endState) {
		const config = ANIMATION_CONFIG;
		config.direction = reverse ? 'reverse' : 'normal';

		if (this.animation) {
			this.animation.cancel();
		}

		this.animation = this.content.animate(
			{ 
				height: [`${this.content.scrollHeight}px`, '0px'],
			},
			config
		);

		this.animation.addEventListener('finish', () => {
			this.animation = null;
			this.state = endState;

			if (endState === STATES.EXPANDED) {
				this.showText.hidden = true;
				this.hideText.hidden = false;
				this.content.removeAttribute('aria-hidden');
			} 
			
			if (endState === STATES.COLLAPSED) {
				this.showText.hidden = false;
				this.hideText.hidden = true;
				this.content.setAttribute('aria-hidden', 'true');
			}
		});
	}
}

const collapse = new Collapse(document.querySelector(SELECTORS.COLLAPSE));