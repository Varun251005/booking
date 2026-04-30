const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = `sess_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

export default getSessionId;
