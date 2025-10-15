import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/mockApiService';
import { Project, ProjectStatus } from '../types';

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

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <Link to={`/project/${project.id}`} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{project.name}</h5>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColorClasses(project.status)}`}>
                    {project.status}
                </span>
            </div>
            <p className="font-normal text-sm text-gray-500 dark:text-gray-400 mb-4">Client: {project.client}</p>
            
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-700 dark:text-white">Progress</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-white">{project.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.completionPercentage}%` }}></div>
                </div>
            </div>
             <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                Due: {new Date(project.endDate).toLocaleDateString()}
            </p>
        </Link>
    );
};

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        api.getProjects().then(data => {
            setProjects(data);
            setLoading(false);
        });
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  project.client.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, statusFilter]);

    if (loading) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading projects...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects Dashboard</h1>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Create Project
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input 
                    type="text"
                    placeholder="Search by name or client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                 <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-48 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                    <option value="All">All Statuses</option>
                    {Object.values(ProjectStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                     <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-8">No projects match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;