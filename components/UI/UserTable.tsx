'use client';

import React, { useState } from 'react';
import { FiEye, FiEdit } from 'react-icons/fi';
import { UserTableData, EditUserFormData } from '@/types';
import { COLORS } from '@/constants';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

interface UserTableProps {
  users: UserTableData[];
  onAction: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onAction }) => {
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<EditUserFormData>({
    name: '',
    email: '',
    status: 'Unrestricted',
  });

  const handleViewDetails = (user: UserTableData) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEditUser = (user: UserTableData) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      console.log('Saving user:', selectedUser.id, editForm);
      onAction(selectedUser.id);
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const closeModal = () => {
    setShowDetails(false);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const getStatusClasses = (status: 'Unrestricted' | 'Restricted') => {
    return status === 'Unrestricted'
      ? `${COLORS.STATUS.UNRESTRICTED.BG} ${COLORS.STATUS.UNRESTRICTED.TEXT}`
      : `${COLORS.STATUS.RESTRICTED.BG} ${COLORS.STATUS.RESTRICTED.TEXT}`;
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
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(user)}
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
                      onClick={() => handleViewDetails(user)}
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={closeModal}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Login</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.lastLogin}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusClasses(selectedUser.status)}`}>
                {selectedUser.status}
              </span>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="edit-status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Unrestricted' | 'Restricted' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color]"
                style={{ ['--ring-color' as any]: COLORS.PRIMARY.BLUE }}
              >
                <option value="Unrestricted">Unrestricted</option>
                <option value="Restricted">Restricted</option>
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
    </>
  );
};

export default UserTable;
