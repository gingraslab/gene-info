import panel from '../templates/panel/panel';
import tooltip from '../templates/tooltip/tooltip';
import State from '../state';

export function selectChange() {
  const index = this.options[this.selectedIndex].value;
  if (State.settings.report === 'detailed') {
    panel(Number(index));
  } else {
    tooltip(undefined, Number(index));
  }
}

export const removeSelectListener = () => {
  const el = State.shadowRoot.getElementById('gene-select');
  if (el) {
    el.removeEventListener('change', selectChange);
  }
};

export const addSelectListener = (results) => {
  if (results.length > 1) {
    const el = State.shadowRoot.getElementById('gene-select');
    el.addEventListener('change', selectChange);
  }
};
