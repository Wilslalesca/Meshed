import React from "react";

interface ClassBlockProps {
    startTime: number;
    endTime: number;
    colour: string;//TODO: don't know if user and colour should be an aspect of the box or what
    userType: string;
}

const ClassBlock: React.FC<ClassBlockProps> = ({ startTime, endTime, userType }) => {
    //Logic to decide what colour the block will be based on the position of the user.
    
}
