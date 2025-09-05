'use client';

import React, { useState } from 'react';
import { FiEye, FiEdit, FiUserCheck, FiMail, FiSlash, FiRotateCcw } from 'react-icons/fi';
import { UserTableData, EditUserFormData } from '@/types';
import { COLORS } from '@/constants';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { useRouter } from 'next/navigation';

interface UserTableProps {
  users: UserTableData[];
  onAction: (userId: string, action?: string) => void;
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
  const [editForm, setEditForm] = useState<EditUserFormData>({
    name: '',
    email: '',
    status: 'Unrestricted',
    role: 'Patient',
    location: ''
  });
  const router = useRouter();



  const handleEditUser = (user: UserTableData) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role || 'Patient',
      location: user.location || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      console.log('Saving user:', selectedUser.id, editForm);
      onAction(selectedUser.id, 'save');
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleSuspend = (user: UserTableData) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const handleResetPassword = (user: UserTableData) => {
    setSelectedUser(user);
    setShowResetModal(true);
  };

  const handleVerifyTherapist = (user: UserTableData) => {
    setSelectedUser(user);
    setShowVerifyModal(true);
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

  const getStatusClasses = (status: 'Unrestricted' | 'Restricted' | 'Pending Verification') => {
    if (status === 'Unrestricted') return `${COLORS.STATUS.UNRESTRICTED.BG} ${COLORS.STATUS.UNRESTRICTED.TEXT}`;
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
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => router.push(`/dashboard/user-management/${encodeURIComponent(user.id)}`)}
                className="p-2 rounded-md transition-colors cursor-pointer text-[#3C5671] hover:opacity-80 hover:bg-[#3C5671]/10"
                title="View Details"
                aria-label="View user details"
              >
                <FiEye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEditUser(user)}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors cursor-pointer"
                title="Edit User"
                aria-label="Edit user"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSuspend(user)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                title="Suspend/Ban"
                aria-label="Suspend/Ban user"
              >
                <FiSlash className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleResetPassword(user)}
                className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-md transition-colors cursor-pointer"
                title="Reset Password"
                aria-label="Reset password"
              >
                <FiRotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleVerifyTherapist(user)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                title="Verify Therapist"
                aria-label="Verify therapist"
              >
                <FiUserCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setSelectedUser(user); setShowMessageModal(true); }}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                title="Send Message"
                aria-label="Send message"
              >
                <FiMail className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(user.status)}`}>
                {user.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.role || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.location || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/dashboard/user-management/${encodeURIComponent(user.id)}`)}
                      className="p-2 rounded-md transition-colors cursor-pointer text-[#3C5671] hover:opacity-80 hover:bg-[#3C5671]/10"
                      title="View Details"
                      aria-label="View user details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors cursor-pointer"
                      title="Edit User"
                      aria-label="Edit user"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSuspend(user)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Suspend/Ban"
                      aria-label="Suspend/Ban user"
                    >
                      <FiSlash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleResetPassword(user)}
                      className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-md transition-colors cursor-pointer"
                      title="Reset Password"
                      aria-label="Reset password"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleVerifyTherapist(user)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                      title="Verify Therapist"
                      aria-label="Verify therapist"
                    >
                      <FiUserCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedUser(user); setShowMessageModal(true); }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                      title="Send Message"
                      aria-label="Send message"
                    >
                      <FiMail className="w-4 h-4" />
                    </button>
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
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-4">
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
            <div>
              <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="edit-role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'Therapist' | 'Patient' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              >
                <option>Therapist</option>
                <option>Patient</option>
              </select>
            </div>
            <Input
              label="Location"
              value={editForm.location || ''}
              onChange={(value) => setEditForm({ ...editForm, location: value })}
              placeholder="Enter location"
            />
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="edit-status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Unrestricted' | 'Restricted' | 'Pending Verification' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color]"
                style={{ '--ring-color': COLORS.PRIMARY.BLUE } as React.CSSProperties}
              >
                <option value="Unrestricted">Unrestricted</option>
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
              <Button onClick={() => { onAction(selectedUser.id, 'reset_password'); closeModal(); }}>Send Link</Button>
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
              <Button onClick={() => { onAction(selectedUser.id, 'verify_therapist'); closeModal(); }}>Verify</Button>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                placeholder="Write your message..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={() => { onAction(selectedUser.id, 'message'); closeModal(); }}>Send</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserTable;