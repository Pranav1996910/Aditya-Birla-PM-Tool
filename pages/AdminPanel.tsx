import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApiService';
import { User, UserRole, AccessLevel } from '../types';

const UserFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User | Omit<User, 'id' | 'avatar'>) => void;
    user: User | null;
}> = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({ name: '', email: ''});

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        } else {
            setFormData({ name: '', email: '' });
        }
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let dataToSave;
        if (user) {
            // Editing existing user, merge form data with existing user data to preserve other fields
            dataToSave = { ...user, ...formData };
        } else {
            // Adding new user, add form data and default role/access
            dataToSave = { 
                ...formData, 
                role: UserRole.MEMBER,
                access: AccessLevel.READ_ONLY
            };
        }
        onSave(dataToSave);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {user ? 'Edit User' : 'Add New User'}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                    </div>
                    <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminPanel = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = () => {
        api.getUsers().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handleDeleteUser = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            api.deleteUser(userId).then(() => {
                setUsers(users.filter(u => u.id !== userId));
            })
        }
    }

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (user: User | Omit<User, 'id' | 'avatar'>) => {
        if ('id' in user) { // Editing existing user
            api.updateUser(user as User).then(updatedUser => {
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            });
        } else { // Adding new user
            api.addUser(user).then(newUser => {
                setUsers([...users, newUser]);
            });
        }
        setIsModalOpen(false);
    }

    if (loading) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading users...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                <button onClick={handleOpenAddModal} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Add User
                </button>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center gap-3">
                                        <img className="w-10 h-10 rounded-full" src={user.avatar} alt={`${user.name} avatar`} />
                                        <div className="font-semibold">{user.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => handleOpenEditModal(user)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UserFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={editingUser}
            />
        </div>
    );
};

export default AdminPanel;