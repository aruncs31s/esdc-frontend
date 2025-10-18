export const mockCourseDetails = {
  1: {
    syllabus: [
      {
        week: 1,
        title: 'Introduction to Arduino',
        topics: ['Arduino IDE Setup', 'Basic Syntax', 'Digital I/O'],
      },
      {
        week: 2,
        title: 'Sensors & Actuators',
        topics: ['Reading Sensors', 'Controlling Motors', 'PWM'],
      },
      { week: 3, title: 'Serial Communication', topics: ['UART', 'I2C', 'SPI'] },
      { week: 4, title: 'Advanced Projects', topics: ['LCD Display', 'Bluetooth Module', 'WiFi'] },
    ],
    reviews: [
      {
        id: 1,
        user: 'Alice Johnson',
        rating: 5,
        comment: 'Excellent course! Very detailed and practical.',
        date: '2025-01-10',
      },
      {
        id: 2,
        user: 'Bob Smith',
        rating: 4,
        comment: 'Great content, would love more projects.',
        date: '2025-01-08',
      },
    ],
    enrolledStudents: [
      { id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1', progress: 85 },
      { id: 2, name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2', progress: 60 },
      { id: 3, name: 'Carol White', avatar: 'https://i.pravatar.cc/150?img=3', progress: 100 },
    ],
    relatedProjects: [
      { id: 1, title: 'Smart Home Automation', author: 'Alice Johnson', likes: 45 },
      { id: 2, title: 'Weather Station', author: 'Bob Smith', likes: 32 },
    ],
    comments: [
      {
        id: 1,
        user: 'David Lee',
        text: 'When does the next batch start?',
        date: '2025-01-12',
        replies: 2,
      },
      {
        id: 2,
        user: 'Emma Davis',
        text: 'Is prior programming knowledge required?',
        date: '2025-01-11',
        replies: 1,
      },
    ],
    likes: 156,
  },
  2: {
    syllabus: [
      {
        week: 1,
        title: 'Raspberry Pi Basics',
        topics: ['OS Installation', 'Linux Commands', 'GPIO'],
      },
      {
        week: 2,
        title: 'Python Programming',
        topics: ['Python Basics', 'Libraries', 'GPIO Control'],
      },
      { week: 3, title: 'IoT Projects', topics: ['Web Server', 'Database', 'APIs'] },
      {
        week: 4,
        title: 'Advanced Topics',
        topics: ['Camera Module', 'AI/ML', 'Cloud Integration'],
      },
    ],
    reviews: [
      {
        id: 1,
        user: 'Frank Miller',
        rating: 5,
        comment: 'Best Raspberry Pi course ever!',
        date: '2025-01-09',
      },
      {
        id: 2,
        user: 'Grace Lee',
        rating: 5,
        comment: 'Instructor is amazing, highly recommend.',
        date: '2025-01-07',
      },
    ],
    enrolledStudents: [
      { id: 1, name: 'Frank Miller', avatar: 'https://i.pravatar.cc/150?img=4', progress: 75 },
      { id: 2, name: 'Grace Lee', avatar: 'https://i.pravatar.cc/150?img=5', progress: 90 },
    ],
    relatedProjects: [
      { id: 1, title: 'Home Security System', author: 'Frank Miller', likes: 67 },
      { id: 2, title: 'Media Center', author: 'Grace Lee', likes: 54 },
    ],
    comments: [
      {
        id: 1,
        user: 'Henry Wilson',
        text: 'Can I use Raspberry Pi 3?',
        date: '2025-01-10',
        replies: 1,
      },
    ],
    likes: 203,
  },
};
