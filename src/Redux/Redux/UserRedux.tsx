
// import { onLogin, Constants } from '../../index';

const types = {
  LOGOUT: 'LOGOUT',
  INTO_LOGIN: 'INTO_LOGIN',
  INTO_MAIN: 'INTO_MAIN'
};

export const UserActions = {
  
  // login: (user, token) => {
  //   return { type: types.LOGIN, user, token };
  // },

  logout() {
    return { type: types.LOGOUT };
  },

  intoLogin() {
    return { type: types.INTO_LOGIN };
  },

  intoMain() {
    return { type: types.INTO_MAIN };
  }
  // update(user) {
  //   return { type: types.UPDATE, user };
  // },
};

const initialState = {
  intoLogin: false,
  intoMain: false
};

export const UserReducer = (state = initialState, action) => {
  const { type } = action;
  switch (type) {

    case types.LOGOUT:
      return {...state, ...{intoMain: false}};
    
    case types.INTO_LOGIN: 
      return {...state, ...{intoLogin: true}};
    
    case types.INTO_MAIN: 
      return {...state, ...{intoMain: true}};

    default:
      return state;
  }
};
