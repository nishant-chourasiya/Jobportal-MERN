import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Briefcase } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Badge } from '../ui/badge'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const { allAppliedJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Fetch applied jobs for students
    if (user?.role === 'student') {
        useGetAppliedJobs();
    }

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-4'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer h-10 w-10">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            <AvatarFallback className="bg-[#6A38C2] text-white font-bold">
                                                {user?.fullname?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-96 p-4">
                                        <div className=''>
                                            {/* User Info Section */}
                                            <div className='flex gap-3 mb-4 pb-4 border-b'>
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                    <AvatarFallback className="bg-[#6A38C2] text-white font-bold text-lg">
                                                        {user?.fullname?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex-1'>
                                                    <h4 className='font-bold text-base'>{user?.fullname}</h4>
                                                    <p className='text-sm text-muted-foreground'>{user?.profile?.bio || "No bio added"}</p>
                                                    <p className='text-xs text-gray-500 mt-1'>{user?.email}</p>
                                                </div>
                                            </div>

                                            {/* Student Options */}
                                            <div className='flex flex-col gap-2 text-gray-600'>
                                                {
                                                    user && user.role === 'student' && (
                                                        <>
                                                            {/* View Profile Link */}
                                                            <div onClick={() => navigate("/profile")} className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition'>
                                                                <User2 className='w-4 h-4' />
                                                                <span className='font-medium'>View Profile</span>
                                                            </div>

                                                            {/* Applied Jobs Link with Badge */}
                                                            <div onClick={() => navigate("/profile")} className='flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded transition'>
                                                                <div className='flex items-center gap-2'>
                                                                    <Briefcase className='w-4 h-4' />
                                                                    <span className='font-medium'>Applied Jobs</span>
                                                                </div>
                                                                {allAppliedJobs?.length > 0 && (
                                                                    <Badge className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white text-xs">
                                                                        {allAppliedJobs.length}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>

                                            {/* Divider */}
                                            <div className='my-3 border-t'></div>

                                            {/* Logout Button */}
                                            <Button 
                                                onClick={logoutHandler} 
                                                variant="outline" 
                                                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <LogOut className='w-4 h-4' />
                                                Logout
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar