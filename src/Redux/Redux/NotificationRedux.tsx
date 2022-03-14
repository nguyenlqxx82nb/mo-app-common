
const types = {
    UPDATE_BADGE: 'UPDATE_BADGE',
  };

  export const NotificationActions = {
    updateBadge: (dispatch, badge) => {
      dispatch({ type: types.UPDATE_BADGE,badge});
    },
  };

  const initialState = {
    badge: 0,
  };

  export const NotificationReducer = (state = initialState, action) => {
    const { badge} = action;
    switch (action.type) {
      case types.UPDATE_BADGE:
        return {...state, badge};
      default:
        return state;
    }
  };
