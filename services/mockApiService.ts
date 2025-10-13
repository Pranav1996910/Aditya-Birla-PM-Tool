import { User, UserRole, Project, ProjectStatus, AccessLevel } from '../types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Admin', email: 'admin@adityabirla.com', mobile: '9876543210', role: UserRole.ADMIN, access: AccessLevel.READ_WRITE, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Bob Manager', email: 'manager@adityabirla.com', mobile: '9876543211', role: UserRole.MANAGER, access: AccessLevel.READ_WRITE, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Charlie Architect', email: 'architect@adityabirla.com', mobile: '9876543212', role: UserRole.MEMBER, access: AccessLevel.READ_WRITE, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Diana Builder', email: 'builder@adityabirla.com', mobile: '9876543213', role: UserRole.MEMBER, access: AccessLevel.READ_WRITE, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Victor Vendor', email: 'vendor@adityabirla.com', mobile: '9876543214', role: UserRole.VENDOR, access: AccessLevel.READ_ONLY, avatar: 'https://i.pravatar.cc/150?u=5' },
];

const generateProgressData = (startDate: Date, endDate: Date, completionPercentage: number) => {
    const idealProgress: { date: string, value: number }[] = [];
    const actualProgress: { date: string, value: number }[] = [];
    const today = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        const timeElapsed = d.getTime() - startDate.getTime();
        const idealValue = Math.min(100, Math.round((timeElapsed / totalDuration) * 100));
        idealProgress.push({ date: d.toISOString().split('T')[0], value: idealValue });

        if (d <= today) {
            const noise = (Math.random() - 0.5) * 10;
            const actualValue = Math.max(0, Math.min(completionPercentage, idealValue + noise));
            actualProgress.push({ date: d.toISOString().split('T')[0], value: Math.round(actualValue) });
        }
    }
    // Ensure the last actual progress point matches the completion percentage
    if (actualProgress.length > 0 && today >= startDate) {
        const lastPointIndex = actualProgress.length - 1;
        const lastDate = new Date(actualProgress[lastPointIndex].date);
        if (today < endDate) {
            actualProgress.push({date: today.toISOString().split('T')[0], value: completionPercentage });
        } else if (lastDate < endDate) {
            actualProgress[lastPointIndex].value = completionPercentage;
        }
    }


    return { idealProgress, actualProgress };
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Aditya Birla - Flagship Retail Store',
    client: 'AB Retail Division',
    description: 'Ground-up construction of a new 20,000 sq. ft. flagship retail location. The project includes site preparation, foundation, structural work, and complete interior fit-out.',
    status: ProjectStatus.ON_TRACK,
    completionPercentage: 65,
    startDate: '2024-05-01',
    endDate: '2024-11-30',
    ...generateProgressData(new Date('2024-05-01'), new Date('2024-11-30'), 65),
    timeline: [
      { id: 't1-1', title: 'Site Survey & Permitting', date: '2024-05-15', description: 'All municipal permits approved.', completed: true, lastModifiedByUserId: '2', lastModifiedAt: '2024-05-16T10:00:00Z' },
      { id: 't1-2', title: 'Foundation Pour', date: '2024-06-20', description: 'Concrete foundation and slab completed.', completed: true, lastModifiedByUserId: '4', lastModifiedAt: '2024-06-21T14:30:00Z' },
      { id: 't1-3', title: 'Structural Steel Erection', date: '2024-08-25', description: 'Main steel frame to be assembled on-site.', completed: false },
      { id: 't1-4', title: 'Client Handover', date: '2024-11-25', description: 'Final walkthrough and key handover.', completed: false },
    ],
    mediaAssets: [
        { id: 'm1-1', type: 'image', url: 'https://picsum.photos/seed/proj1-1/800/600', title: 'Architectural Blueprints' },
        { id: 'm1-2', type: 'image', url: 'https://picsum.photos/seed/proj1-2/800/600', title: 'Site Photos - Week 5' },
    ],
    teamMemberIds: ['2', '3', '4', '5']
  },
  {
    id: 'proj-2',
    name: 'Urban Square Mall - Interior Fit-out',
    client: 'Urban Square Properties',
    description: 'Complete interior fit-out for a new 5,000 sq. ft. store within an existing mall. Includes MEP, drywall, flooring, and fixture installation.',
    status: ProjectStatus.AT_RISK,
    completionPercentage: 35,
    startDate: '2024-06-15',
    endDate: '2025-01-15',
    ...generateProgressData(new Date('2024-06-15'), new Date('2025-01-15'), 35),
    timeline: [
        { id: 't2-1', title: 'Design Approval', date: '2024-06-30', description: 'Final interior designs signed off by client.', completed: true, lastModifiedByUserId: '3', lastModifiedAt: '2024-07-01T09:00:00Z' },
        { id: 't2-2', title: 'MEP Rough-in', date: '2024-08-15', description: 'Mechanical, Electrical, and Plumbing rough-in complete.', completed: true, lastModifiedByUserId: '4', lastModifiedAt: '2024-08-16T11:00:00Z' },
        { id: 't2-3', title: 'HVAC Unit Delivery', date: '2024-09-10', description: 'Main HVAC unit delivery delayed by vendor.', completed: false },
    ],
    mediaAssets: [
        { id: 'm2-1', type: 'image', url: 'https://picsum.photos/seed/proj2-1/800/600', title: 'Rendered Interior Views' },
    ],
    teamMemberIds: ['2', '3', '5']
  },
  {
    id: 'proj-3',
    name: 'Highway Plaza - Kiosk Pod',
    client: 'Highway Plaza Management',
    description: 'Design and build a new semi-permanent kiosk pod in the central plaza. Project is fast-tracked for holiday season opening.',
    status: ProjectStatus.COMPLETED,
    completionPercentage: 100,
    startDate: '2024-07-01',
    endDate: '2024-08-15',
    ...generateProgressData(new Date('2024-07-01'), new Date('2024-08-15'), 100),
     timeline: [
        { id: 't3-1', title: 'Fabrication', date: '2024-07-15', description: 'Off-site fabrication of kiosk components.', completed: true, lastModifiedByUserId: '5', lastModifiedAt: '2024-07-16T11:00:00Z' },
        { id: 't3-2', title: 'On-site Assembly', date: '2024-08-10', description: 'Final assembly and utility hookup.', completed: true, lastModifiedByUserId: '4', lastModifiedAt: '2024-08-11T16:45:00Z' },
        { id: 't3-3', title: 'Go-live', date: '2024-08-14', description: 'Kiosk operational and open to public.', completed: true, lastModifiedByUserId: '1', lastModifiedAt: '2024-08-14T10:00:00Z' },
    ],
    mediaAssets: [],
    teamMemberIds: ['1', '2', '4', '5']
  },
  {
    id: 'proj-4',
    name: 'Corporate HQ - Lobby Renovation',
    client: 'AB Corporate Services',
    description: 'Complete renovation of the main corporate headquarters lobby. Involves high-end finishes and custom millwork.',
    status: ProjectStatus.OFF_TRACK,
    completionPercentage: 40,
    startDate: '2024-06-01',
    endDate: '2024-10-15',
    ...generateProgressData(new Date('2024-06-01'), new Date('2024-10-15'), 40),
    timeline: [
        { id: 't4-1', title: 'Demolition', date: '2024-06-10', description: 'Existing lobby fixtures and finishes removed.', completed: true, lastModifiedByUserId: '4', lastModifiedAt: '2024-06-11T12:00:00Z' },
        { id: 't4-2', title: 'Custom Millwork Delivery', date: '2024-08-20', description: 'Custom reception desk and paneling delivery is delayed due to vendor supply chain issues.', completed: false },
        { id: 't4-3', title: 'Final Installation', date: '2024-10-10', description: 'Installation of all fixtures and finishes.', completed: false },
    ],
    mediaAssets: [
         { id: 'm4-1', type: 'image', url: 'https://picsum.photos/seed/proj4-1/800/600', title: 'Lobby Design Mockup' },
    ],
    teamMemberIds: ['2', '3']
  },
  {
    id: 'proj-5',
    name: 'Logistics Warehouse Expansion',
    client: 'AB Logistics Group',
    description: 'Phase 1 of a major warehouse expansion, adding 100,000 sq. ft. of storage space. Currently on hold pending final budget approval.',
    status: ProjectStatus.ON_HOLD,
    completionPercentage: 15,
    startDate: '2024-08-01',
    endDate: '2025-05-01',
    ...generateProgressData(new Date('2024-08-01'), new Date('2025-05-01'), 15),
    timeline: [
        { id: 't5-1', title: 'Geotechnical Survey', date: '2024-08-10', description: 'Soil and site analysis completed.', completed: true, lastModifiedByUserId: '3', lastModifiedAt: '2024-08-11T15:00:00Z' },
        { id: 't5-2', title: 'Budgetary Review', date: '2024-08-30', description: 'Project is on hold awaiting Q4 budget allocation.', completed: false },
    ],
    mediaAssets: [],
    teamMemberIds: ['1', '2']
  },
   {
    id: 'proj-6',
    name: 'Multi-level Car Park Construction',
    client: 'City Development Authority',
    description: 'Construction of a 5-level precast concrete parking structure for 500 vehicles.',
    status: ProjectStatus.ON_TRACK,
    completionPercentage: 25,
    startDate: '2024-07-15',
    endDate: '2025-03-31',
    ...generateProgressData(new Date('2024-07-15'), new Date('2025-03-31'), 25),
    timeline: [
      { id: 't6-1', title: 'Excavation & Shoring', date: '2024-08-05', description: 'Site excavation completed.', completed: true, lastModifiedByUserId: '4', lastModifiedAt: '2024-08-06T18:00:00Z' },
      { id: 't6-2', title: 'Precast Component Delivery', date: '2024-09-01', description: 'First batch of precast concrete panels to arrive on schedule.', completed: false },
    ],
    mediaAssets: [
      { id: 'm6-1', type: 'image', url: 'https://picsum.photos/seed/proj6-1/800/600', title: 'Structural Plans' },
    ],
    teamMemberIds: ['2', '4', '5']
  }
];

// In a real app, these would be API calls. We use Promises to simulate async behavior.
export const api = {
  getProjects: (): Promise<Project[]> => Promise.resolve(MOCK_PROJECTS),
  getProjectById: (id: string): Promise<Project | undefined> => Promise.resolve(MOCK_PROJECTS.find(p => p.id === id)),
  getUsers: (): Promise<User[]> => Promise.resolve(MOCK_USERS),
  addUser: (user: Omit<User, 'id' | 'avatar'>): Promise<User> => {
    const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    MOCK_USERS.push(newUser);
    return Promise.resolve(newUser);
  },
  updateUser: (user: User): Promise<User> => {
    const index = MOCK_USERS.findIndex(u => u.id === user.id);
    if (index !== -1) {
      MOCK_USERS[index] = user;
      return Promise.resolve(user);
    }
    return Promise.reject(new Error('User not found'));
  },
  deleteUser: (userId: string): Promise<{ success: boolean }> => {
    const index = MOCK_USERS.findIndex(u => u.id === userId);
     if (index !== -1) {
      MOCK_USERS.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('User not found'));
  },
  updateTimelineEvent: (projectId: string, event: import('../types').TimelineEvent, userId: string): Promise<import('../types').TimelineEvent> => {
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    if(project) {
        const eventIndex = project.timeline.findIndex(e => e.id === event.id);
        if(eventIndex !== -1) {
            const updatedEvent = {
                ...event,
                lastModifiedByUserId: userId,
                lastModifiedAt: new Date().toISOString()
            };
            project.timeline[eventIndex] = updatedEvent;
            return Promise.resolve(updatedEvent);
        }
    }
    return Promise.reject(new Error('Event not found'));
  }
};