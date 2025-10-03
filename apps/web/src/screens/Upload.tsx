import React from 'react';
import { useAuth } from '../hooks/useAuth';
import {DndContext} from '@dnd-kit/core';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Upload: React.FC = () => {
  const { user } = useAuth();
  return (
    /**<div className="wrap bg-muted">
        <div className="container mx-auto px-10 py-10" >
            <div class="bg-white p-10 rounded-lg shadow-lg">
                <p className="text-lg text-muted-foreground">Upload</p>
            </div>
        </div>
    </div>**/
    <body className= "bg-muted">
        <section className="px-10 py-10">
            <div className="container justify-between items-center">
                <div className="flex items-center">
                    <Card className= "w-full max-w-sm shadow-lg">
                        <CardHeader>
                            <CardTitle>Upload your schedule</CardTitle>
                            <CardDescription>Go to your student portal and export your schedule in csv, pdf, or iCal formats</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <p>Add dndkit here :P</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </body>
    
  );
};