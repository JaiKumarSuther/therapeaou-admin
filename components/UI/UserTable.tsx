'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiEye, FiEdit, FiUserCheck, FiMail, FiSlash, FiRotateCcw, FiMoreVertical } from 'react-icons/fi';
import { UserTableData, EditUserFormData } from '@/types';
import { COLORS } from '@/constants';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { useRouter } from 'next/navigation';

interface UserTableProps {
  users: UserTableData[];
  onAction: (userId: string, action?: string, data?: EditUserFormData) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onAction }) => {
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null);
  // const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [editForm, setEditForm] = useState<EditUserFormData>({
    name: '',
    email: '',
    status: 'Active',
    location: '',
    phone: '',
    gender: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    specialization: '',
    therapyField: '',
    title: '',
    experience: '',
    consultationFee: ''
  });
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      let clickedInside = false;
      
      dropdownRefs.current.forEach((ref) => {
        if (ref && ref.contains(target)) {
          clickedInside = true;
        }
      });
      
      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const setDropdownRef = (userId: string) => (ref: HTMLDivElement | null) => {
    if (ref) {
      dropdownRefs.current.set(userId, ref);
    } else {
      dropdownRefs.current.delete(userId);
    }
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const handleActionClick = (userId: string, action: string, event?: React.MouseEvent | React.TouchEvent) => {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setOpenDropdown(null);
    
    // Small delay to ensure dropdown closes before modal opens
    setTimeout(() => {
      const user = users.find(u => u.id === userId);
      if (user) {
        switch (action) {
          case 'view':
            router.push(`/dashboard/user-management/${encodeURIComponent(userId)}`);
            break;
          case 'edit':
            handleEditUser(user);
            break;
          case 'verify':
            handleVerifyTherapist(user);
            break;
          case 'suspend':
            handleSuspend(user);
            break;
          case 'reset':
            handleResetPassword(user);
            break;
          case 'message':
            setSelectedUser(user);
            setShowMessageModal(true);
            break;
        }
      }
    }, 100);
  };

  const handleEditUser = (user: UserTableData) => {
    console.log('Opening edit modal for user:', user);
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status,
      location: user.location || '',
      phone: user.phone || '',
      gender: user.gender || '',
      country: user.country || '',
      city: user.city || '',
      address: user.address || '',
      postalCode: user.postalCode || '',
      specialization: user.specialization || '',
      therapyField: user.therapyField || '',
      title: user.title || '',
      experience: user.experience || '',
      consultationFee: user.consultationFee || ''
    });
    setShowEditModal(true);
    console.log('Edit modal state set to true');
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      console.log('Saving user:', selectedUser.id, editForm);
      onAction(selectedUser.id, 'save', editForm);
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleSuspend = (user: UserTableData) => {
    console.log('Opening suspend modal for user:', user);
    setSelectedUser(user);
    setShowSuspendModal(true);
    console.log('Suspend modal state set to true');
  };

  const handleResetPassword = (user: UserTableData) => {
    console.log('Opening reset password modal for user:', user);
    setSelectedUser(user);
    setShowResetModal(true);
    console.log('Reset modal state set to true');
  };

  const handleVerifyTherapist = (user: UserTableData) => {
    console.log('Opening verify modal for user:', user);
    setSelectedUser(user);
    setShowVerifyModal(true);
    console.log('Verify modal state set to true');
  };

  const closeModal = () => {
    // setShowDetails(false);
    setShowEditModal(false);
    setShowSuspendModal(false);
    setShowResetModal(false);
    setShowVerifyModal(false);
    setShowMessageModal(false);
    setSelectedUser(null);
  };

  const getStatusClasses = (status: 'Active' | 'Restricted' | 'Pending Verification') => {
    if (status === 'Active') return `${COLORS.STATUS.UNRESTRICTED.BG} ${COLORS.STATUS.UNRESTRICTED.TEXT}`;
    if (status === 'Restricted') return `${COLORS.STATUS.RESTRICTED.BG} ${COLORS.STATUS.RESTRICTED.TEXT}`;
    return `${COLORS.STATUS.PENDING.BG} ${COLORS.STATUS.PENDING.TEXT}`;
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {users.map((user, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">ID:</span>
                <span className="ml-1 font-medium text-gray-900">{user.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Login:</span>
                <span className="ml-1 font-medium text-gray-900">{user.lastLogin}</span>
              </div>
              <div>
                <span className="text-gray-500">Role:</span>
                <span className="ml-1 font-medium text-gray-900">{user.role || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500">Location:</span>
                <span className="ml-1 font-medium text-gray-900">{user.location || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500">
                  {user.role === 'Therapist' ? 'Specialization:' : 'Gender:'}
                </span>
                <span className="ml-1 font-medium text-gray-900">
                  {user.role === 'Therapist' 
                    ? (user.specialization || '—')
                    : (user.gender || '—')
                  }
                </span>
              </div>
              {user.role === 'Therapist' && user.rating && (
                <div>
                  <span className="text-gray-500">Rating:</span>
                  <span className="ml-1 font-medium text-gray-900">{user.rating}/5</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(user.status)}`}>
                {user.status}
              </span>
              <div className="relative" ref={setDropdownRef(user.id)}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDropdown(user.id);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDropdown(user.id);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  title="Actions"
                  aria-label="User actions"
                >
                  <FiMoreVertical className="w-4 h-4" />
                </button>
                
                {openDropdown === user.id && (
                  <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] bg-white rounded-md shadow-lg z-50 border border-gray-200 sm:right-0 -right-2">
                    <div className="py-1">
                      <button
                        onClick={(e) => handleActionClick(user.id, 'view', e)}
                        onTouchEnd={(e) => handleActionClick(user.id, 'view', e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <FiEye className="w-4 h-4 mr-3" />
                        View Details
                      </button>
                      <button
                        onClick={(e) => handleActionClick(user.id, 'edit', e)}
                        onTouchEnd={(e) => handleActionClick(user.id, 'edit', e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <FiEdit className="w-4 h-4 mr-3" />
                        Edit User
                      </button>
                      {user.role === 'Therapist' && (
                        <button
                          onClick={(e) => handleActionClick(user.id, 'verify', e)}
                          onTouchEnd={(e) => handleActionClick(user.id, 'verify', e)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        >
                          <FiUserCheck className="w-4 h-4 mr-3" />
                          Verify Therapist
                        </button>
                      )}
                      <button
                        onClick={(e) => handleActionClick(user.id, 'suspend', e)}
                        onTouchEnd={(e) => handleActionClick(user.id, 'suspend', e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <FiSlash className="w-4 h-4 mr-3" />
                        Suspend/Ban
                      </button>
                      <button
                        onClick={(e) => handleActionClick(user.id, 'reset', e)}
                        onTouchEnd={(e) => handleActionClick(user.id, 'reset', e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <FiRotateCcw className="w-4 h-4 mr-3" />
                        Reset Password
                      </button>
                      <button
                        onClick={(e) => handleActionClick(user.id, 'message', e)}
                        onTouchEnd={(e) => handleActionClick(user.id, 'message', e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                      >
                        <FiMail className="w-4 h-4 mr-3" />
                        Send Message
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization/Details
              </th>
              <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-sm font-medium text-gray-900 truncate">
                  {user.id}
                </td>
                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                  {user.name}
                </td>
                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                  {user.email}
                </td>
                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                  {user.role || '—'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                  {user.location || '—'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                  {user.role === 'Therapist' 
                    ? (user.specialization || '—')
                    : (user.gender || '—')
                  }
                </td>
                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                  {user.lastLogin}
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm font-medium">
                  <div className="relative" ref={setDropdownRef(user.id)}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown(user.id);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown(user.id);
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 rounded-md transition-colors cursor-pointer"
                      title="Actions"
                      aria-label="User actions"
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                    
                    {openDropdown === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={(e) => handleActionClick(user.id, 'view', e)}
                            onTouchEnd={(e) => handleActionClick(user.id, 'view', e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <FiEye className="w-4 h-4 mr-3" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => handleActionClick(user.id, 'edit', e)}
                            onTouchEnd={(e) => handleActionClick(user.id, 'edit', e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <FiEdit className="w-4 h-4 mr-3" />
                            Edit User
                          </button>
                          {user.role === 'Therapist' && (
                            <button
                              onClick={(e) => handleActionClick(user.id, 'verify', e)}
                              onTouchEnd={(e) => handleActionClick(user.id, 'verify', e)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                            >
                              <FiUserCheck className="w-4 h-4 mr-3" />
                              Verify Therapist
                            </button>
                          )}
                          <button
                            onClick={(e) => handleActionClick(user.id, 'suspend', e)}
                            onTouchEnd={(e) => handleActionClick(user.id, 'suspend', e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <FiSlash className="w-4 h-4 mr-3" />
                            Suspend/Ban
                          </button>
                          <button
                            onClick={(e) => handleActionClick(user.id, 'reset', e)}
                            onTouchEnd={(e) => handleActionClick(user.id, 'reset', e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <FiRotateCcw className="w-4 h-4 mr-3" />
                            Reset Password
                          </button>
                          <button
                            onClick={(e) => handleActionClick(user.id, 'message', e)}
                            onTouchEnd={(e) => handleActionClick(user.id, 'message', e)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <FiMail className="w-4 h-4 mr-3" />
                            Send Message
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModal}
        title={`Edit ${selectedUser?.role || 'User'}`}
      >
        {selectedUser && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-sm text-gray-500">{selectedUser.id}</p>
            </div>
            
            <Input
              label="Name"
              value={editForm.name}
              onChange={(value) => setEditForm({ ...editForm, name: value })}
              placeholder="Enter user name"
            />
            
            <Input
              type="email"
              label="Email"
              value={editForm.email}
              onChange={(value) => setEditForm({ ...editForm, email: value })}
              placeholder="Enter email address"
            />
            
            <Input
              label="Phone"
              value={(editForm.phone as string) || ''}
              onChange={(value) => setEditForm({ ...editForm, phone: value })}
              placeholder="Enter phone number"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-500">{selectedUser.role || '—'}</p>
            </div>
            
            <Input
              label="Location"
              value={(editForm.location as string) || ''}
              onChange={(value) => setEditForm({ ...editForm, location: value })}
              placeholder="Enter location"
            />
            
            <Input
              label="Country"
              value={(editForm.country as string) || ''}
              onChange={(value) => setEditForm({ ...editForm, country: value })}
              placeholder="Enter country"
            />
            
            <Input
              label="City"
              value={(editForm.city as string) || ''}
              onChange={(value) => setEditForm({ ...editForm, city: value })}
              placeholder="Enter city"
            />
            
            <Input
              label="Address"
              value={(editForm.address as string) || ''}
              onChange={(value) => setEditForm({ ...editForm, address: value })}
              placeholder="Enter address"
            />
            
            <Input
              label="Postal Code"
              value={(editForm.postalCode as string) || ''}
              onChange={(value) => setEditForm({ ...editForm, postalCode: value })}
              placeholder="Enter postal code"
            />
            
            <div>
              <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="edit-gender"
                value={(editForm.gender as string) || ''}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color] text-gray-900 bg-white"
                style={{ '--ring-color': COLORS.PRIMARY.BLUE } as React.CSSProperties}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Therapist-specific fields */}
            {selectedUser.role === 'Therapist' && (
              <>
                <Input
                  label="Title"
                  value={(editForm.title as string) || ''}
                  onChange={(value) => setEditForm({ ...editForm, title: value })}
                  placeholder="e.g., Dr., Prof."
                />
                
                <Input
                  label="Specialization"
                  value={(editForm.specialization as string) || ''}
                  onChange={(value) => setEditForm({ ...editForm, specialization: value })}
                  placeholder="e.g., Clinical Psychology"
                />
                
                <Input
                  label="Therapy Field"
                  value={(editForm.therapyField as string) || ''}
                  onChange={(value) => setEditForm({ ...editForm, therapyField: value })}
                  placeholder="e.g., Cognitive Behavioral Therapy"
                />
                
                <Input
                  label="Experience (years)"
                  value={(editForm.experience as string) || ''}
                  onChange={(value) => setEditForm({ ...editForm, experience: value })}
                  placeholder="Enter years of experience"
                />
                
                <Input
                  label="Consultation Fee"
                  value={(editForm.consultationFee as string) || ''}
                  onChange={(value) => setEditForm({ ...editForm, consultationFee: value })}
                  placeholder="Enter consultation fee"
                />
              </>
            )}
            
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="edit-status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Restricted' | 'Pending Verification' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color] text-gray-900 bg-white"
                style={{ '--ring-color': COLORS.PRIMARY.BLUE } as React.CSSProperties}
              >
                <option value="Active">Active</option>
                <option value="Restricted">Restricted</option>
                <option value="Pending Verification">Pending Verification</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Suspend/Ban Modal */}
      <Modal isOpen={showSuspendModal} onClose={closeModal} title="Suspend User">
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Are you sure you want to suspend/ban <span className="font-semibold">{selectedUser.name}</span> ({selectedUser.email})?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={() => { onAction(selectedUser.id, 'suspend'); closeModal(); }}>Confirm</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={showResetModal} onClose={closeModal} title="Reset Password">
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Send a password reset link to <span className="font-semibold">{selectedUser.email}</span>?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={() => { onAction(selectedUser.id, 'reset-password'); closeModal(); }}>Send Link</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Verify Therapist Modal */}
      <Modal isOpen={showVerifyModal} onClose={closeModal} title="Verify Therapist">
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Approve verification for <span className="font-semibold">{selectedUser.name}</span>?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={() => { onAction(selectedUser.id, 'verify'); closeModal(); }}>Verify</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Message Modal */}
      <Modal isOpen={showMessageModal} onClose={closeModal} title="Send Message">
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">To</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.name} ({selectedUser.email})</p>
            </div>
            <Input label="Subject" value={messageSubject} onChange={setMessageSubject} placeholder="Subject" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-900 placeholder-gray-500"
                placeholder="Write your message..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={() => { onAction(selectedUser.id, 'send-message'); closeModal(); }}>Send</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserTable;