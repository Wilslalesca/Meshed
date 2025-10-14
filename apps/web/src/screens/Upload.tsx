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
        console.log(files);
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

        try{
            const response = await fetch("http://localhost:4000/upload",{
                method: "POST",
                body: fileData,
            });
            //alert(`Files selected: ${files.map(f => f.name).join(", ")}`);
            alert(JSON.stringify(response));
            navigate('/dashboard'); 
        }
        catch{
            alert('Error Uploading Files');
        }
    }

    return (
        <div className= "bg-muted min-h-screen flex items-center justify-center">
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