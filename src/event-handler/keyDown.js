let callBacks = [];

export default {
  onKeyDown: (event: Object) => {
    callBacks.forEach((callBack) => {
      callBack(event);
    });
  },

  registerCallBack: (callBack): void => { },

  deregisterCallBack: (callBack): void => {
    callBacks = callBacks.filter(cb => cb !== callBack);
  },
};
