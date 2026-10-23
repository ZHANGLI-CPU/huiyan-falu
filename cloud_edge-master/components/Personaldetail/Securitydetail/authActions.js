// src/actions/authActions.js
export const logout = () => {
    return (dispatch) => {
      // 这里可以添加登出逻辑，比如调用 API 清除会话等
      dispatch({ type: 'LOGOUT' });
    };
  };
  