import { useState, type JSX } from 'react';
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components//ui/button";
import { apiUploadCourses } from '@/features/upload/api/upload'
import { apiAddCourseAndAthleteCourse } from '@/features/add-edit-courses/api/addcourse'
import DropzoneField from "@/shared/components/ui/dropzonefield";
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/shared/components/ui/dialog';

export function Upload(): JSX.Element {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[] | undefined>();

    const handleDrop = (files: File[]) => {
        setFiles(files);
    };

    const handleSubmit = async () => {
        if (!files) {
            toast.error("No files selected!");
            return;
        }

        const fileData = new FormData();
        files.forEach((file) => {
            fileData.append("files", file);
        });

        try {
            const uploadResponse = await apiUploadCourses(fileData);
            if (
                uploadResponse &&
                uploadResponse.schedule &&
                uploadResponse?.course_times
            ) {
                const parsedSchedule = uploadResponse.course_times;
                for (let i = 0; i < parsedSchedule.length; i++) {
                    const athleteCourseResponse =
                        await apiAddCourseAndAthleteCourse(
                            parsedSchedule[i],
                            user?.id
                        );
                    if (!athleteCourseResponse.success) {
                        throw new Error(athleteCourseResponse.message);
                    }
                }
            }
            toast.success("Files Uploaded Successfully");
        } catch (err) {
            console.error("Unknown error Adding Course:", err);
            return { success: false, message: String(err) };
        }
        window.location.reload();
    }

    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button className="flex-1 sm:flex-none" >Upload iCal</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload your schedule</DialogTitle>
                    <DialogDescription>Go to your student portal and export your schedule in csv, pdf, or iCal formats</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col p-4 items-center">
                    <DropzoneField onDrop={handleDrop} />
                    <Button type="submit" onClick={handleSubmit} className="w-full gap-3">Submit</Button>
                </div>
        </DialogContent>
        </Dialog>
    );
};
