import React, { useState } from 'react';
import { User, BookOpen, Search } from 'lucide-react';
import { Teacher } from '../types';

interface TeacherListProps {
  teachers: Teacher[];
  selectedTeacher: Teacher | null;
  onSelectTeacher: (teacher: Teacher) => void;
}

const TeacherList: React.FC<TeacherListProps> = ({ 
  teachers, 
  selectedTeacher, 
  onSelectTeacher 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-50 p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center mb-3">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          <span>Teachers</span>
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or subject..."
            className="w-full border rounded-md pl-9 pr-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div 
              key={teacher.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-blue-50 ${
                selectedTeacher?.id === teacher.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => onSelectTeacher(teacher)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{teacher.subject}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No teachers found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;