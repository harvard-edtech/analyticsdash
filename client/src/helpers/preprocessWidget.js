/**
 * Given a widget, pre-process it and return a fully-formed object
 * @author Gabe Abrams
 * @param {Widget} widget - the original widget
 * @return {Widget} pre-processed widget
 */
export default (originalWidget) => {
  const widget = originalWidget;

  /* ------------------------ Add Defaults ------------------------ */

  widget.initialConfiguration = widget.initialConfiguration || {};

  /* ---------------------- Convert Booleans ---------------------- */

  widget.configurable = !!widget.configurable;
  widget.configureOnAdd = !!widget.configureOnAdd;

  /* ----------------------- Required Fields ---------------------- */
  [
    'id',
    'ContentComponent',
    'metadata',
  ].forEach((prop) => {
    if (!widget[prop]) {
      if (prop === 'id') {
        throw new Error('A widget is missing an id.');
      }
      throw new Error(`Widget with ID "${widget.id}" has no ${prop} but ${prop} is required.`);
    }
  });

  // Conditional requirements
  if (
    widget.configurable
    && !widget.ConfigureComponent
  ) {
    throw new Error(`Widget with ID "${widget.id}" is configurable but has no configuration contents.`);
  }

  // Metadata pieces
  [
    'title',
    'subtitle',
    'description',
    'icon',
  ].forEach((prop) => {
    if (!widget.metadata[prop]) {
      throw new Error(`Widget with ID "${widget.id}" has no ${prop} in its metadata.`);
    }
  });

  /* ----------------- For components, use default ---------------- */
  widget.ContentComponent = (
    widget.ContentComponent.default
    || widget.ContentComponent
  );
  widget.HelpComponent = (
    widget.HelpComponent
      ? (widget.HelpComponent.default || widget.HelpComponent)
      : null
  );
  widget.ConfigureComponent = (
    widget.ConfigureComponent
      ? (widget.ConfigureComponent.default || widget.ConfigureComponent)
      : null
  );

  /* --------------------------- Wrap Up -------------------------- */
  return widget;
};
