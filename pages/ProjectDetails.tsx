import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { api } from '../services/mockApiService';
import { Project, TimelineEvent, MediaAsset, User, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const CircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/></svg>
);


const ProgressChart: React.FC<{ data: Project | null }> = ({ data }) => {
    if (!data) return null;
    const chartData = data.idealProgress.map(ideal => {
        const actual = data.actualProgress.find(a => a.date === ideal.date);
        return {
            date: ideal.date,
            'Ideal Progress': ideal.value,
            'Actual Progress': actual ? actual.value : null,
        }
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorIdeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4A5568', color: '#E5E7EB' }} />
                    <Legend />
                    <Area type="monotone" dataKey="Ideal Progress" stroke="#82ca9d" fillOpacity={1} fill="url(#colorIdeal)" />
                    <Area type="monotone" dataKey="Actual Progress" stroke="#8884d8" fillOpacity={1} fill="url(#colorActual)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const TimelineManager: React.FC<{ project: Project; onUpdate: (updatedProject: Project) => void; users: User[]; currentUser: User; }> = ({ project, onUpdate, users, currentUser }) => {
    
    const handleToggleComplete = (event: TimelineEvent) => {
        const updatedEvent = {...event, completed: !event.completed};
        api.updateTimelineEvent(project.id, updatedEvent, currentUser.id).then(res => {
            const updatedTimeline = project.timeline.map(e => e.id === res.id ? res : e);
            onUpdate({...project, timeline: updatedTimeline});
        });
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Timeline</h3>
                <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Event</button>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {project.timeline.map(event => (
                    <li key={event.id} className="py-4 flex items-start space-x-4">
                       <button onClick={() => handleToggleComplete(event)} className="mt-1">
                          {event.completed ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-gray-400"/>}
                       </button>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className={`text-md font-semibold ${event.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>{event.title}</p>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                            {event.lastModifiedByUserId && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    Last modified by {users.find(u => u.id === event.lastModifiedByUserId)?.name || 'Unknown User'}
                                    {event.lastModifiedAt ? ` on ${new Date(event.lastModifiedAt).toLocaleString()}`: ''}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                             <button className="p-1 text-gray-500 hover:text-blue-500"><EditIcon className="w-4 h-4" /></button>
                             <button className="p-1 text-gray-500 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MediaGallery: React.FC<{ assets: MediaAsset[] }> = ({ assets }) => (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media & Assets</h3>
        {assets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map(asset => (
                    <div key={asset.id} className="group relative">
                        <img src={asset.url} alt={asset.title} className="w-full h-32 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm text-center p-2">{asset.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400">No media assets for this project.</p>
        )}
    </div>
);

const TeamMembers: React.FC<{ members: User[] }> = ({ members }) => (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
        <div className="flex flex-wrap gap-4">
            {members.map(member => (
                <div key={member.id} className="flex flex-col items-center text-center group relative">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full mb-2 object-cover" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{member.name.split(' ')[0]}</span>
                    <div className="absolute bottom-full mb-2 w-max p-2 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                       {member.name} <span className="capitalize font-semibold">({member.role})</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const RoleDetailsSection: React.FC<{ title: string; members: User[] }> = ({ title, members }) => (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-4">
            {members.map(member => (
                <div key={member.id} className="flex items-center gap-4">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                        {member.mobile && <p className="text-sm text-gray-500 dark:text-gray-400">{member.mobile}</p>}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const ReportGenerator: React.FC<{ project: Project }> = ({ project }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsModalOpen(true);
        setIsLoading(true);
        setIsLoading(false);
    };
    
    const handlePrint = () => {
        const printableContent = document.getElementById('report-content')?.innerHTML;
        const originalContent = document.body.innerHTML;
        if(printableContent) {
            document.body.innerHTML = `<body class="bg-white dark:bg-gray-900">${printableContent}</body>`;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); // to re-attach event listeners
        }
    }

    return (
        <>
            <button onClick={handleGenerate} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                Generate Report
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project Report</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
                        </div>
                        <div id="report-content" className="p-6 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Status as of {new Date().toLocaleDateString()}</p>
                            {isLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                </div>
                            ) : (
                                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">Summary detailsgi</div>
                            )}
                        </div>
                         <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
                            <button onClick={handlePrint} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Print</button>
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const ProjectDetails = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjectData = useCallback(async () => {
        if (id) {
            setLoading(true);
            try {
                const projectData = await api.getProjectById(id);
                if (projectData) {
                    setProject(projectData);
                    const users = await api.getUsers();
                    setAllUsers(users);
                    const members = users.filter(user => projectData.teamMemberIds.includes(user.id));
                    setTeamMembers(members);
                } else {
                    setProject(null);
                }
            } catch (error) {
                console.error("Failed to fetch project data:", error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        }
    }, [id]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const handleProjectUpdate = (updatedProject: Project) => {
        setProject(updatedProject);
    };

    const { vendors, architects } = useMemo(() => {
        const vendors = teamMembers.filter(member => member.role === UserRole.VENDOR);
        const architects = teamMembers.filter(member => member.role === UserRole.MEMBER && member.name.toLowerCase().includes('architect'));
        return { vendors, architects };
    }, [teamMembers]);


    if (loading) return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading project details...</div>;
    if (!project || !currentUser) return <div className="text-center p-8 text-red-500">Project not found or user not authenticated.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                    <p className="text-md text-gray-500 dark:text-gray-400">Client: {project.client}</p>
                </div>
                <div className="flex items-center gap-4">
                     <button className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700">Notify Client</button>
                    <ReportGenerator project={project} />
                </div>
            </div>
            
            <ProgressChart data={project} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <TimelineManager project={project} onUpdate={handleProjectUpdate} users={allUsers} currentUser={currentUser} />
                 <div className="space-y-6">
                    <TeamMembers members={teamMembers} />
                    {architects.length > 0 && <RoleDetailsSection title="Architects" members={architects} />}
                    {vendors.length > 0 && <RoleDetailsSection title="Vendors" members={vendors} />}
                    <MediaGallery assets={project.mediaAssets} />
                 </div>
            </div>
        </div>
    );
};

export default ProjectDetails;