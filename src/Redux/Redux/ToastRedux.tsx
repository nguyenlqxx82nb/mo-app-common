
const types = {
    ADD_TOAST: 'ADD_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
  };

  export const ToastActions = {
    addToast: (msg: string, type: string,  key: string) => {
      return { type: types.ADD_TOAST, payload: { msg, type, key } };
    },
    removeToast: (key: string) => {
      return { type: types.REMOVE_TOAST, payload: { key } };
    },
  };

  const initialState = {
    list: [],
  };

  export const ToastReducer = (state = initialState, action: any) => {
    const { type, payload } = action;
    const { list } = state;

    switch (type) {
      case types.ADD_TOAST: {
        return {
          ...state,
          list: list.some((toast: any) => toast.msg === payload.msg)
            ? list
            : [payload, ...list],
        };
      }
      case types.REMOVE_TOAST: {
        return {
          ...state,
          list: list.filter((msg: any) => msg.key !== payload.key),
        };
      }
      default: {
        return state;
      }
    }
 };
