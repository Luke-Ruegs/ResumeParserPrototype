import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  data: any;
  onConfirm: (data: any) => void;
  onCancel: () => void;
}

export function ConfirmationDialog({ data, onConfirm, onCancel }: ConfirmationDialogProps) {
  const [editedData, setEditedData] = useState(data);

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...editedData.skills];
    newSkills[index] = value;
    setEditedData({ ...editedData, skills: newSkills });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Confirm Resume Information</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
              <div className="space-y-2">
                {editedData.skills.map((skill: string, index: number) => (
                  <input
                    key={index}
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
              {editedData.experience.map((exp: any, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-2">
                  <div className="font-medium">{exp.title}</div>
                  <div className="text-gray-600">{exp.company}</div>
                  <div className="text-sm text-gray-500">{exp.duration}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Education</h3>
              {editedData.education.map((edu: any, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-2">
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-gray-600">{edu.school}</div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-900">Please Review</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Confirm that the extracted information is correct. You can edit any incorrect details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(editedData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}