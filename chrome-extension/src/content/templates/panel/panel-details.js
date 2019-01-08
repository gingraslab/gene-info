import basicElement from './basic';
import descriptionElement from './description';
import domainElement from './domain';
import geneElement from '../gene';
import goElement from './go';
import interactorElement from './interactor';
import linkElement from './link';
import localizationElement from './localization';
import rnaExpressionElement from './rna-expression';
import State from '../../state';

const reportDetails = (result, reportIndex, stateStyle) => {
  let style = '';
  if (stateStyle.right) {
    style += `left: auto; right: ${stateStyle.right};`;
  } else if (stateStyle.left) {
    style += `left: ${stateStyle.left}; right: 'auto'`;
  }
  if (stateStyle.width) {
    style += `width: ${stateStyle.width};`;
  }
  return `
    <aside
      id="panel"
      style="${style}"
    >
      <div class="panel__inner">
        <section>
          <h1>Gene</h1>
          ${geneElement(result, reportIndex)}
        </section>
        ${basicElement(result[reportIndex], State.settings)}
        ${linkElement(result[reportIndex], State.settings)}
        ${descriptionElement(result[reportIndex], State.settings)}
        ${domainElement(result[reportIndex], State.settings)}
        ${rnaExpressionElement(result[reportIndex], State.settings)}
        ${goElement(result[reportIndex], State.settings)}
        ${localizationElement(result[reportIndex], State.settings)}
        ${interactorElement(result[reportIndex], State.settings)}
      </div>
    </aside>
  `;
};

export default reportDetails;
