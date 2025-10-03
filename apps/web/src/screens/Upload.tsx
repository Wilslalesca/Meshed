import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Upload: React.FC = () => {
  const { user } = useAuth();
  return (
    <body className= "bg-muted">
        <section className="px-10 py-10">
            <div className="container justify-between items-center">
                <div className="flex items-center">
                    <Card className= "w-full max-w-sm shadow-lg">
                        <CardHeader>
                            <CardTitle>Upload your schedule</CardTitle>
                            <CardDescription>Go to your student portal and export your schedule in csv, pdf, or iCal formats</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-col gap-2 items-center">
                            <Button asChild className="items-center w-full" variant="secondary" >
                                <Input type="file">
                                </Input>
                            </Button>
                            <Button type="submit" className="w-full">Submit</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </body>
    
  );
};