/**
 * Function to compute whether two action arrays are equal
 * @author Grace Whitney
 */

const actionsHaveChanged = (oldActions, newActions) => {
  return (
    (!oldActions && newActions)
    || (oldActions.length !== newActions.length)
    || newActions.some((action, i) => {
      return (action.key !== oldActions[i].key);
    })
  );
};

export default actionsHaveChanged;
