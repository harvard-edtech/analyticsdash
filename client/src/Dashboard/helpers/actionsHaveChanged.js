/**
 * Function to compute whether two action arrays are equal
 * @author Grace Whitney
 */

const actionsHaveChanged = (oldActions, newActions) => {
  return (
    // Change occurred if this is the first time we are receiving actions
    (!oldActions && newActions)
    // Change occurred if there's a different number of actions
    || (oldActions.length !== newActions.length)
    // Change occurred if any keys don't match or if actions were reordered
    || newActions.some((action, i) => {
      return (action.key !== oldActions[i].key);
    })
  );
};

export default actionsHaveChanged;
