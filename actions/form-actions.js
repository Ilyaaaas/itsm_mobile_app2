export const SET_INFO = "info:set";
export const RESET_INFO = "info:reset";

export const setFormInfo = (type, data = {}) => {
  return {
    type: SET_INFO,
    payload: {
      type: type,
      data: data
    }
  };
};

export const resetFormInfo = () => {
  return {
    type: RESET_INFO,
    payload: {}
  };
};
