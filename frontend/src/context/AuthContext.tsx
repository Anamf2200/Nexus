import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { RootState } from '../store/store';
import { logout as logoutAction, setCredentials } from '../store/slices/authSlice';
import { useLoginMutation,useRegisterMutation } from '../store/auth/authApi';
import { AuthContextType, User, UserRole } from '..';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [loginApi, { isLoading: loginLoading }] = useLoginMutation();
  const [registerApi, { isLoading: registerLoading }] = useRegisterMutation();

  // ✅ LOGIN (RTK Query)
  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const res = await loginApi({ email, password, role }).unwrap();

      dispatch(setCredentials({
        token: res.access_token,
        user: res.user,
      }));

      toast.success('Successfully logged in');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed');
      throw err;
    }
  };

  // ✅ REGISTER (RTK Query)
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const res = await registerApi({ name, email, password, role }).unwrap();

      dispatch(setCredentials({
        token: res.access_token,
        user: res.user,
      }));

      toast.success('Account created successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // ⚠️ TEMPORARY — can stay until backend is ready
  const forgotPassword = async (email: string) => {
    toast.success('Password reset email sent (mock)');
  };

  const resetPassword = async (token: string, newPassword: string) => {
    toast.success('Password reset successful (mock)');
  };

  // ✅ LOGOUT
  const logout = () => {
    dispatch(logoutAction());
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile: async () => {},
    isAuthenticated: !!token,
    isLoading: loginLoading || registerLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Hook stays SAME everywhere
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
