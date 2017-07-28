function removeTooltip() {
  const container = document.getElementById('cExtension_gene_info_tooltip_container');
  if(container) {
    container.removeEventListener('click', clearTooltip);
    document.getElementById('cExtension_gene_info_tooltip_button').removeEventListener('click', removeTooltip);
    const changeEl = document.getElementById('cExtension_gene_info_geneSelect');
    if (changeEl) {
      changeEl.removeEventListener('change', selectChange);
    }
    window.removeEventListener('scroll', tooltipScroll.scroll);
    fadeOut(container);
  }
}
