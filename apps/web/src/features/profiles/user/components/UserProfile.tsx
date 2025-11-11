import React from 'react';
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button"
import { Pencil, Check } from "lucide-react";
import {apiEditUser} from "../apis/editprofile"
import { toast } from "sonner";

export function UserProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(true)

    const [firstname, setFirstName] = React.useState(user?.firstName);
    const [lastname, setLastName] = React.useState(user?.lastName);
    const [email, setEmail] = React.useState(user?.email);
    const [phone, setPhone] = React.useState(user?.phone);

    const handleSubmit = async () => {
        if (!firstname || !lastname) {
            toast.error("Please fill in all required fields before submitting!");
            return;
        }

        const plainUser = JSON.parse(JSON.stringify(user));
        const userData = {
            id: plainUser.id,
            first_name: firstname ?? "",
            last_name: lastname ?? "",
            phone: phone ?? "",
            email: plainUser.email ?? "",
            role: plainUser.role,
            password_hash: plainUser.passwordHash,
            active: plainUser.active,
            verified: plainUser.verified,
        } as any;

        const success = await apiEditUser(plainUser.id, userData);
        if(success){
            setDisabled((prev) => !prev);
            toast.success("Successfully updated profile");
            navigate('/profile');
        }
        else{
            toast.error("Error updating profile, please try again");
        }
    }
    
    return (
        <div className="m-4 gap-4">
            <form>
                <div className="w-full">
                    <div className='px-2 py-2'>
                        <h1 className="text-2xl font-bold">User Profile</h1>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="w-md items-center gap-3 px-2 py-2">
                            <Label htmlFor="name">First Name</Label>
                            <Input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={firstname}
                                disabled = {disabled}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="w-md items-center gap-3 px-2 py-2">
                            <Label htmlFor="name">Last Name</Label>
                            <Input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={lastname}
                                disabled = {disabled}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="w-md items-center gap-3 px-2 py-2">
                            <Label htmlFor="name">Email</Label>
                            <Input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                disabled = {true}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="w-md items-center gap-3 px-2 py-2">
                            <Label htmlFor="name">Phone Number</Label>
                            <Input
                                type="text"
                                id="phone"
                                name="phone"
                                value={phone}
                                disabled = {disabled}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex float-right'>
                    {disabled
                    ? <Button
                        type="button" 
                        size="icon"
                        variant="outline"
                        onClick={() => setDisabled((prev) => !prev)}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    :
                        <Button
                        type="button" 
                        size="icon"
                        variant="outline"
                        onClick={handleSubmit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                    }
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
