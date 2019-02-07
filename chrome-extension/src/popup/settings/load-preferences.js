import activationCheckbox from './activation-checkbox';
import menus from './menus';
import namspaceCheckbox from './namespace-checkbox';
import reportCheckbox from './report-checkbox';
import theme from './theme';
import toggles from './toggles';

const loadPreferences = () => {
  activationCheckbox();
  menus();
  namspaceCheckbox();
  reportCheckbox();
  theme();
  toggles();
};

export default loadPreferences;
