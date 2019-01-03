import panel from '../templates/panel';
import State from '../state';

export function selectChange() {
  const index = this.options[this.selectedIndex].value;
  if (State.settings.report === 'detailed') {
    panel(Number(index));
  } else {
    // createTooltipTemplate();
  }
}

export const removeSelectListener = () => {
  const el = document.getElementById('gene-info__select');
  if (el) {
    el.removeEventListener('change', selectChange);
  }
};

export const addSelectListener = (results) => {
  if (results.length > 1) {
    const el = document.getElementById('gene-info__select');
    el.addEventListener('change', selectChange);
  }
};
