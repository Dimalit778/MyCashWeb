import { useGetUserQuery, useLogoutMutation } from "api/slicesApi/userApiSlice";
import { clearCredentials } from "config/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(undefined, {
    skip: !userInfo,
  });
  const logout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(clearCredentials());
      navigate("/");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const isAuthenticated = !!userInfo;

  return {
    user: userInfo,
    isAuthenticated,
    isLoading,
    error,
    logout,
    refetch,
  };
};

export default useAuth;
