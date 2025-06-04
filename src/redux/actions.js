export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER_AGE = 'SET_USER_AGE';
export const INCREASE_AGE = 'INCREASE_AGE';
export const LIST_TICKE = 'LIST_TICKE';
export const DATA_USER = 'DATA_USER';
export const CLEAR_TICKE = 'CLEAR_TICKE';
export const LIST_OUT = 'LIST_OUT';
export const LIST_TAU = 'LIST_TAU';
export const LIST_LD = 'LIST_LD';

export const setName = name => dispatch => {
  dispatch({
    type: SET_USER_NAME,
    payload: name,
  });
};

export const setAge = age => dispatch => {
  dispatch({
    type: SET_USER_AGE,
    payload: age,
  });
};

export const increaseAge = age => dispatch => {
  dispatch({
    type: INCREASE_AGE,
    payload: age,
  });
};

export const listTicke = list => dispatch => {
  dispatch({
    type: LIST_TICKE,
    payload: list,
  });
};
export const clearTicke = () => dispatch => {
  dispatch({
    type: CLEAR_TICKE,
  });
};
export const dataUser = list => dispatch => {
  dispatch({
    type: DATA_USER,
    payload: list,
  });
};
export const listOUTs = list => dispatch => {
  dispatch({
    type: LIST_OUT,
    payload: list,
  });
};
export const LSTAU = list => dispatch => {
  dispatch({
    type: LIST_TAU,
    payload: list,
  });
};
export const LISTLDO = list => dispatch => {
  dispatch({
    type: LIST_LD,
    payload: list,
  });
};
