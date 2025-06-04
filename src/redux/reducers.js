import {
  SET_USER_NAME,
  SET_USER_AGE,
  INCREASE_AGE,
  LIST_TICKE,
  DATA_USER,
  CLEAR_TICKE,
  LIST_OUT,
  LIST_TAU,
  LIST_LD,
} from './actions';

const initialState = {
  name: [],
  age: 0,
  listTK: [],
  dataUser: [],
  listOUT: [],
  listTAU: [],
  listLD: [],
};

function userReducer(state = initialState, action) {
  // console.log(action.type);
  switch (action.type) {
    case SET_USER_NAME:
      return {...state, name: action.payload};
    case SET_USER_AGE:
      return {...state, age: action.payload};
    case INCREASE_AGE:
      return {...state, age: state.age + 1};
    case LIST_TICKE:
      return {...state, listTK: action.payload};
    case DATA_USER:
      return {...state, dataUser: action.payload};
    case CLEAR_TICKE:
      return {...state, listTK: []};
    case LIST_OUT:
      return {...state, listOUT: action.payload};
    case LIST_TAU:
      return {...state, listTAU: action.payload};
    case LIST_LD:
      return {...state, listLD: action.payload};
    default:
      return state;
  }
}

export default userReducer;
