import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Users, UserCircle, FileText, Send, Building2, Calendar, MapPin } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useGetProfileQuery, useUpdateProfileImageMutation } from '../../store/user/userApi';
import { createCollaborationRequest, getRequestsFromInvestor } from '../../data/collaborationRequests';
import { DollarSign } from 'lucide-react';

export const EntrepreneurProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const { data: profile } = useGetProfileQuery();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(profile)

const entrepreneur = profile && profile._id === id ? profile : null;

  if (!entrepreneur || entrepreneur.role !== 'entrepreneur') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Entrepreneur not found</h2>
        <p className="text-gray-600 mt-2">The entrepreneur profile you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === entrepreneur.id;
  const isInvestor = currentUser?.role === 'investor';
  const hasRequestedCollaboration = isInvestor && id
    ? getRequestsFromInvestor(currentUser.id).some(req => req.entrepreneurId === id)
    : false;

  const handleSendRequest = () => {
    if (isInvestor && currentUser && id) {
      createCollaborationRequest(
        currentUser.id,
        id,
        `I'm interested in learning more about ${entrepreneur.name} and would like to explore potential investment opportunities.`
      );
      window.location.reload();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await updateProfileImage(file).unwrap();
      alert('Profile image updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile image');
    }

  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card>
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <div className="relative">
              <Avatar
                src={entrepreneur.profileImage ? `${import.meta.env.VITE_API_URL}/uploads/${entrepreneur.profileImage}` : ""}
                alt={entrepreneur.name}
                size="xl"
                className="mx-auto sm:mx-0"
              />
              {isCurrentUser && (
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleUpload}
                  className="absolute bottom-0 right-0 w-8 h-8 opacity-0 cursor-pointer"
                />
              )}
            </div>

            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{entrepreneur.name}</h1>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                <Building2 size={16} className="mr-1" /> Founder at {/* Static: Replace with placeholder */}
                Awesome Startup
              </p>

            {Array.isArray(entrepreneur.startupHistory) && entrepreneur.startupHistory.length > 0 && (
  <Badge variant="primary">
    Startup History: {entrepreneur.startupHistory.filter(Boolean).join(', ')}
  </Badge>
)}

{Array.isArray(entrepreneur.investmentHistory) && entrepreneur.investmentHistory.length > 0 && (
  <Badge variant="secondary">
    Investments: {entrepreneur.investmentHistory.filter(Boolean).join(', ')}
  </Badge>
)}

{Array.isArray(entrepreneur.preferences) && entrepreneur.preferences.length > 0 && (
  <Badge variant="accent">
    Preferences: {entrepreneur.preferences.filter(Boolean).join(', ')}
  </Badge>
)}

            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            {!isCurrentUser && (
              <>
                <Link to={`/messages`}>
                  <Button variant="outline" leftIcon={<MessageCircle size={18} />}>Message</Button>
                </Link>
                {isInvestor && (
                  <Button
                    leftIcon={<Send size={18} />}
                    disabled={hasRequestedCollaboration}
                    onClick={handleSendRequest}
                  >
                    {hasRequestedCollaboration ? 'Request Sent' : 'Request Collaboration'}
                  </Button>
                )}
              </>
            )}

            {isCurrentUser && (
              <Button variant="outline" leftIcon={<UserCircle size={18} />}>Edit Profile</Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">About</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700">{entrepreneur.bio || 'No bio available'}</p>
        </CardBody>
      </Card>

      {/* Startup Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Startup Overview</h2>
        </CardHeader>
        <CardBody>
          {(entrepreneur.startupHistory ?? []).length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {(entrepreneur.startupHistory ?? []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No startup history provided.</p>
          )}
        </CardBody>
      </Card>

      {/* Team, Funding, Documents sections remain fully static from previous layout */}
      {/* Team */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Team</h2>
          <span className="text-sm text-gray-500">5 members</span>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center p-3 border border-gray-200 rounded-md">
              <Avatar
                src={entrepreneur.profileImage ? `${import.meta.env.VITE_API_URL}/uploads/profile/${entrepreneur.profileImage}` : ""}
                alt={entrepreneur.name}
                size="md"
                className="mr-3"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{entrepreneur.name}</h3>
                <p className="text-xs text-gray-500">Founder & CEO</p>
              </div>
            </div>
            {/* Other team members - static */}
            <div className="flex items-center p-3 border border-gray-200 rounded-md">
              <Avatar src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" alt="Team Member" size="md" className="mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Alex Johnson</h3>
                <p className="text-xs text-gray-500">CTO</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-md">
              <Avatar src="https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg" alt="Team Member" size="md" className="mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Jessica Chen</h3>
                <p className="text-xs text-gray-500">Head of Product</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-3 border border-dashed border-gray-200 rounded-md">
              <p className="text-sm text-gray-500">+ 2 more team members</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Funding */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Funding</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Current Round</span>
              <div className="flex items-center mt-1">
                <DollarSign size={18} className="text-accent-600 mr-1" />
                <p className="text-lg font-semibold text-gray-900">$500K</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Valuation</span>
              <p className="text-md font-medium text-gray-900">$8M - $12M</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Previous Funding</span>
              <p className="text-md font-medium text-gray-900">$750K Seed (2022)</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-primary-50 rounded-md mr-3">
                <FileText size={18} className="text-primary-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Pitch Deck</h3>
                <p className="text-xs text-gray-500">Updated 2 months ago</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-primary-50 rounded-md mr-3">
                <FileText size={18} className="text-primary-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Business Plan</h3>
                <p className="text-xs text-gray-500">Updated 1 month ago</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
