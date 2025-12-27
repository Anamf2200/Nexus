import React, { useRef, useState, useEffect } from 'react';
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  CreditCard,
} from 'lucide-react';

import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  useChangePasswordMutation
} from '../../store/user/userApi';

export const SettingsPage: React.FC = () => {
  const { data: user, isLoading,refetch } = useGetProfileQuery();

  const [updateProfile] = useUpdateProfileMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
  useChangePasswordMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------- Local State ----------------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [startupHistory, setStartupHistory] = useState('');
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
  // Sync RTK Query data → local state
  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
      setBio(user.bio ?? '');
      setStartupHistory(
        Array.isArray(user.startupHistory)
          ? user.startupHistory.join(', ')
          : ''
      );
    }
  }, [user]);

  if (isLoading || !user) return null;

  // ---------------- Handlers ----------------
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name,
        email,
        bio,
        startupHistory: startupHistory
          .split(',')
          .map(i => i.trim())
          .filter(Boolean),
      }).unwrap();
      refetch()

      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };
const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('All password fields are required');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    await changePassword({
      currentPassword,
      newPassword,
    }).unwrap();

    alert('Password updated successfully');

    // reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (err: any) {
    console.error(err);
    alert(err?.data?.message || 'Failed to update password');
  }
};


  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateProfileImage(file).unwrap();
            refetch()
      alert('Profile image updated');
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    }
  };

  // ---------------- Image URL ----------------
  const profileImageSrc =
    user.profileImage
      ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImage}`
      : '';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardBody className="p-2">
            <nav className="space-y-1">
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md">
                <User size={18} className="mr-3" />
                Profile
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Lock size={18} className="mr-3" />
                Security
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Bell size={18} className="mr-3" />
                Notifications
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Globe size={18} className="mr-3" />
                Language
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Palette size={18} className="mr-3" />
                Appearance
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <CreditCard size={18} className="mr-3" />
                Billing
              </button>
            </nav>
          </CardBody>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Profile Settings
              </h2>
            </CardHeader>

            <CardBody className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar
                  src={profileImageSrc}
                  alt={user.name}
                  size="xl"
                />

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG or PNG. Max 800KB
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

                <Input
                  label="Role"
                  value={user.role}
                  disabled
                />

                {/* Static */}
                <Input
                  label="Location"
                  value="San Francisco, CA"
                  disabled
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>

              {/* Startup History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Startup History
                </label>
                <Input
                  placeholder="Comma separated"
                  value={startupHistory}
                  onChange={e => setStartupHistory(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Security Settings (STATIC like previous page) */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Security Settings
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Two-Factor Authentication
                </h3>
                <Badge variant="error">Not Enabled</Badge>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Change Password
                </h3>

                <div className="space-y-4">
                  <Input label="Current Password" type="password"
                    value={currentPassword}
                   onChange={e => setCurrentPassword(e.target.value)}
                  
                  
                  />
                  
                  <Input label="New Password" type="password"
                    value={newPassword}
                   onChange={e => setNewPassword(e.target.value)}
                  />
                  <Input label="Confirm New Password" type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}/>

                  <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                {isChangingPassword ? 'Updating...' : 'Update Password'}
                     </Button>      
                                 </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
