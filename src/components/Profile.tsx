import React, { useState } from 'react';
import { Save } from 'lucide-react';
import '../styles/profile.css';

interface ProfileData {
  company: string;
  userName: string;
  name: string;
  officeAddress: string;
  factoryAddress: string;
  city: string;
  mobile: string;
  email: string;
  gstin: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'view' | 'password'>('view');
  const [isEditing, setIsEditing] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    company: '',
    userName: '',
    name: '',
    officeAddress: '',
    factoryAddress: '',
    city: '',
    mobile: '',
    email: '',
    gstin: ''
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // TO SAVE DATA IN BACKEND LOGIC
    console.log('Saving profile:', profileData);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // CHNAGE PASSWORD LOGIC
    console.log('Changing password');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <h2 className="profile-title">Update Profile and Password</h2>
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'view' ? (
          <div className="profile-form">
            <h3 className="section-title">Profile</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>User Name:</label>
                <input
                  type="text"
                  value={profileData.userName}
                  onChange={(e) => setProfileData({ ...profileData, userName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Office Address:</label>
                <textarea
                  value={profileData.officeAddress}
                  onChange={(e) => setProfileData({ ...profileData, officeAddress: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Factory Address:</label>
                <textarea
                  value={profileData.factoryAddress}
                  onChange={(e) => setProfileData({ ...profileData, factoryAddress: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Mobile:</label>
                <input
                  type="text"
                  value={profileData.mobile}
                  onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                  disabled={!isEditing}
                  maxLength={10}
                />
              </div>
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>GSTIN:</label>
                <input
                  type="text"
                  value={profileData.gstin}
                  onChange={(e) => setProfileData({ ...profileData, gstin: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="form-actions">
              {isEditing ? (
                <button onClick={handleSave} className="save-btn">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
              ) : (
                <button onClick={handleEdit} className="edit-btn">
                  Edit
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="password-form">
            <h3 className="section-title">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Old Password:</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <Save className="w-4 h-4 mr-2" />
                  Change Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;