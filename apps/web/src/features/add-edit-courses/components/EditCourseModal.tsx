import type { Schedule } from '@/features/athlete-schedule/types/Schedule';
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
//import { apiUpdateCourse } from "@/features/add-edit-courses/api/updateCourse";

interface EditCourseModalProps {
  course: Schedule;
  onClose: () => void;
  onSave: () => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState(course);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    /*const success = await apiUpdateCourse(formData);
    if (success) onSave();
    else alert("Failed to update course");*/
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <div className="p-4">
        <h2>Edit Course</h2>
        <input name="name" value={formData.name} onChange={handleChange} />
        <input name="location" value={formData.location} onChange={handleChange} />
        <input name="start_time" value={formData.start_time} onChange={handleChange} />
        <input name="end_time" value={formData.end_time} onChange={handleChange} />
        <div className="mt-4 flex gap-2">
          <Button onClick={handleSubmit}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Dialog>
  );
};
