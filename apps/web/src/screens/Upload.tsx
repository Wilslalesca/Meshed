import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DropzoneField from "@/components/ui/dropzonefield";

export const Upload: React.FC = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[] | undefined>();
    const navigate = useNavigate();

    const handleDrop = (files: File[]) => {
        setFiles(files);
    };

    const handleSubmit = async () => {
        if (!files) {
            alert("No files selected!");
            return;
        }

        const fileData = new FormData();
        files.forEach(file=>{
            fileData.append("files",file);
        });

        var sendSchedule = false;
        var parsedSchedule: any[] = [];
        
        try{
            const response = await fetch("http://localhost:4000/upload",{
                method: "POST",
                body: fileData,
            });

            const data = await response.json();
            sendSchedule = data.schedule;
            parsedSchedule = data.course_times;
            alert(JSON.stringify(data.message));
        }
        catch{
            alert('Error Uploading Files');
        }

        //create course_time in the DB
        var courseTimeSuccess = false;
        var courseTimeIds = new Array(parsedSchedule.length);
        if(sendSchedule){
            for(var i =0; i<parsedSchedule.length ; i++){
                try{
                    const response = await fetch("http://localhost:4000/schedule/coursetime",{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(parsedSchedule[i]),
                    });

                    const data = await response.json();
                    courseTimeSuccess = data.success;
                    courseTimeIds[i] = data.course_time.id;
                }
                catch{
                    console.log('Error Creating Schedule');
                    courseTimeSuccess = false;
                }
            }
        }
        
        //create student course connection in DB
        if(courseTimeSuccess){
            for(var i =0; i<parsedSchedule.length ; i++){
                try{
                    const response = await fetch("http://localhost:4000/schedule/athletecoursetime",{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({athlete_id: user?.id, class_id:courseTimeIds[i]}),
                    });

                    const data = await response.json();
                }
                catch{
                    console.log('Error Adding Athlete Schedule');
                }
            }
        }
        navigate('/dashboard'); 
    }

    return (
        <div className= "bg-white min-h-screen flex items-center justify-center">
            <Card className= "w-full max-w-sm shadow-lg">
                <CardHeader>
                    <CardTitle>Upload your schedule</CardTitle>
                    <CardDescription>Go to your student portal and export your schedule in csv, pdf, or iCal formats</CardDescription>
                </CardHeader>
                <CardContent className="flex-col gap-2 items-center">
                    <DropzoneField onDrop={handleDrop} />
                    <Button type="submit" onClick={handleSubmit} className="w-full">Submit</Button>
                </CardContent>
            </Card>
        </div>
        
    );
};