import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/mockApiService';
import { User, Project, ProjectStatus, UserRole, AccessLevel } from '../types';

const getStatusColorClasses = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.ON_TRACK:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case ProjectStatus.AT_RISK:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case ProjectStatus.OFF_TRACK:
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case ProjectStatus.ON_HOLD:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        case ProjectStatus.COMPLETED:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const ContactFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id' | 'avatar' | 'access'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        mobile: '', 
        role: UserRole.MEMBER 
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', email: '', mobile: '', role: UserRole.MEMBER });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as UserRole }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Member</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                         <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                            <label htmlFor="mobile" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile Number</label>
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} pattern="[0-9]{10}" title="Please enter a 10-digit mobile number" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                                {Object.values(UserRole).map(role => (
                                    <option key={role} value={role} className="capitalize">{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Member</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const UploadCloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
);


const UserDetailsPane: React.FC<{ 
    user: User; 
    projects: Project[]; 
    invoices: File[];
    onAddInvoice: (userId: string, file: File) => void;
    onClose: () => void; 
}> = ({ user, projects, invoices, onAddInvoice, onClose }) => {
    const [isDragging, setIsDragging] = useState(false);
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach(file => onAddInvoice(user.id, file));
            e.dataTransfer.clearData();
        }
    };
    
    const handleDownload = (file: File) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Email:</strong> {user.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Mobile:</strong> {user.mobile || 'N/A'}</p>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Invoices</h4>
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                >
                    <UploadCloudIcon className="w-8 h-8 mx-auto mb-2"/>
                    <p>Drag & drop invoices here</p>
                </div>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
                    {invoices.map((file, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                            <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                            <button onClick={() => handleDownload(file)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <DownloadIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                    {invoices.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No invoices uploaded.</p>
                    )}
                </div>
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                 <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Associated Projects</h4>
                 <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {projects.length > 0 ? projects.map(project => (
                        <Link to={`/project/${project.id}`} key={project.id} className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{project.name}</p>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColorClasses(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">This user is not associated with any projects.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};


const Directory = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInvoices, setUserInvoices] = useState<Map<string, File[]>>(new Map());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [usersData, projectsData] = await Promise.all([
                api.getUsers(),
                api.getProjects(),
            ]);
            setUsers(usersData);
            setProjects(projectsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const projectsForSelectedUser = useMemo(() => {
        if (!selectedUser) return [];
        return projects.filter(project => project.teamMemberIds.includes(selectedUser.id));
    }, [projects, selectedUser]);
    
    const handleSaveContact = (contactData: Omit<User, 'id' | 'avatar' | 'access'>) => {
        const userToSave = {
            ...contactData,
            access: AccessLevel.READ_ONLY 
        };
        api.addUser(userToSave).then(newUser => {
            setUsers(prevUsers => [...prevUsers, newUser].sort((a,b) => a.name.localeCompare(b.name)));
            setIsModalOpen(false);
        });
    };
    
    const handleAddInvoice = useCallback((userId: string, file: File) => {
        setUserInvoices(prevMap => {
            const newMap = new Map(prevMap);
            const existingFiles = newMap.get(userId) || [];
            newMap.set(userId, [...existingFiles, file]);
            return newMap;
        });
    }, []);

    if (loading) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading directory...</div>;
    }

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Directory</h1>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                    Add New Member
                </button>
            </div>
            
            <div className="mb-6">
                <input 
                    type="text"
                    placeholder="Filter by name, role, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`transition-all duration-300 ${selectedUser ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredUsers.map(user => (
                            <div 
                                key={user.id} 
                                onClick={() => setSelectedUser(user)}
                                className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer border-2 transition-all ${selectedUser?.id === user.id ? 'border-blue-500' : 'border-transparent hover:border-blue-400'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedUser && (
                    <div className="md:col-span-1">
                        <UserDetailsPane 
                            user={selectedUser} 
                            projects={projectsForSelectedUser}
                            invoices={userInvoices.get(selectedUser.id) || []}
                            onAddInvoice={handleAddInvoice}
                            onClose={() => setSelectedUser(null)} 
                        />
                    </div>
                )}
            </div>
            <ContactFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveContact}
            />
        </div>
    );
};

export default Directory;
