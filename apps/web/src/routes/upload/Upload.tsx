import React, { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components//ui/button";
import { useNavigate } from "react-router-dom";
import { apiUploadCourses } from "@/features/upload/api/upload";
import { apiAddCourseAndAthleteCourse } from "@/features/add-edit-courses/api/addcourse";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components//ui/card";
import DropzoneField from "@/shared/components//ui/dropzonefield";
import { toast } from "sonner";

export const Upload: React.FC = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[] | undefined>();
    const navigate = useNavigate();

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
                for (var i = 0; i < parsedSchedule.length; i++) {
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
        navigate("/dashboard");
    };

    const addCourse = async () => {
        navigate("/addcourse");
    };

    return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader>
                    <CardTitle>Upload your schedule</CardTitle>
                    <CardDescription>
                        Go to your student portal and export your schedule in
                        csv, pdf, or iCal formats
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col p-4 items-center">
                    <DropzoneField onDrop={handleDrop} />
                    <Button
                        type="submit"
                        onClick={addCourse}
                        className="w-full gap-3 bg-cyan-500 hover:bg-cyan-800"
                    >
                        Add/Edit your Schedule
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full gap-3"
                    >
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
