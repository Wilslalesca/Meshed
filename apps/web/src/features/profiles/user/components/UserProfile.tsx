import React from 'react';
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Pencil, Check } from "lucide-react";
import {apiEditUser} from "../apis/editprofile"
import { apiMe } from "@/features/auth/api/auth"
import { toast } from "sonner";

export function UserProfile() {
    const token = localStorage.getItem("auth_token") ?? "";
    const [user, setUser] = useState<any>(null);
    const [firstname, setFirstName] = React.useState("");
    const [lastname, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiMe(token);
                setUser(data);
            } catch (err) {
                console.error("Failed to load user:", err);
            }
        };

        fetchUser();
    }, [token]);


    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(true)

    React.useEffect(() => {
        if (user) {
            setFirstName(user?.firstName);
            setLastName(user?.lastName);
            setEmail(user?.email);
            setPhone(user?.phone);
        }
    }, [user]);

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
                                value={firstname || ""}
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
                                value={lastname || ""}
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
                                value={email || ""}
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
                                value={phone || ""}
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
