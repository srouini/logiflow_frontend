const useProfile = () => {
  const _default = {
    colorPrimary: "#FA541C",
    siderMenuType: "sub",
    layout: "top",
  };

  const _profile = localStorage.getItem("profile");
  const profile = _profile !== null ? JSON.parse(_profile) : _default;

  return {profile};
};

export default useProfile;
