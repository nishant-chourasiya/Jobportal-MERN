import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Edit, Globe, MapPin, Calendar, Briefcase } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import CompanySetup from './CompanySetup'

const CompanyDetail = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const { singleCompany } = useSelector(store => store.company);
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);

    if (isEditMode) {
        return <CompanySetup />;
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10'>
                {/* Back Button */}
                <div className='flex items-center gap-3 mb-8'>
                    <Button 
                        onClick={() => navigate("/admin/companies")} 
                        variant="outline" 
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold"
                    >
                        <ArrowLeft className='w-4 h-4' />
                        <span>Back to Companies</span>
                    </Button>
                </div>

                {/* Company Detail Card */}
                <div className='bg-white border border-gray-200 rounded-2xl shadow-lg p-8'>
                    {/* Header Section */}
                    <div className='flex items-start justify-between mb-8 pb-8 border-b'>
                        <div className='flex items-start gap-6'>
                            {/* Logo */}
                            <Avatar className="h-32 w-32 rounded-lg shadow-md">
                                <AvatarImage src={singleCompany?.logo} alt={singleCompany?.name} className="object-cover" />
                                <AvatarFallback className="text-4xl font-bold bg-[#6A38C2] text-white rounded-lg">
                                    {singleCompany?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* Company Name & Description */}
                            <div className='flex-1'>
                                <h1 className='text-4xl font-bold text-gray-900 mb-2'>{singleCompany?.name}</h1>
                                <p className='text-gray-600 text-lg leading-relaxed max-w-lg'>{singleCompany?.description}</p>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Button 
                            onClick={() => setIsEditMode(true)}
                            className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white flex items-center gap-2 rounded-lg"
                        >
                            <Edit className='w-4 h-4' />
                            Edit Company
                        </Button>
                    </div>

                    {/* Company Info Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                        {/* Website */}
                        <div className='flex items-center gap-4'>
                            <div className='bg-blue-100 p-3 rounded-lg'>
                                <Globe className='w-6 h-6 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-600 mb-1'>Website</p>
                                <a 
                                    href={singleCompany?.website} 
                                    target='_blank' 
                                    rel='noreferrer'
                                    className='text-lg font-semibold text-blue-600 hover:underline break-all'
                                >
                                    {singleCompany?.website}
                                </a>
                            </div>
                        </div>

                        {/* Location */}
                        <div className='flex items-center gap-4'>
                            <div className='bg-red-100 p-3 rounded-lg'>
                                <MapPin className='w-6 h-6 text-red-600' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-600 mb-1'>Location</p>
                                <p className='text-lg font-semibold text-gray-900'>{singleCompany?.location}</p>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className='flex items-center gap-4'>
                            <div className='bg-green-100 p-3 rounded-lg'>
                                <Calendar className='w-6 h-6 text-green-600' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-600 mb-1'>Company Registered</p>
                                <p className='text-lg font-semibold text-gray-900'>
                                    {singleCompany?.createdAt?.split("T")[0]}
                                </p>
                            </div>
                        </div>

                        {/* Jobs Posted */}
                        <div className='flex items-center gap-4'>
                            <div className='bg-purple-100 p-3 rounded-lg'>
                                <Briefcase className='w-6 h-6 text-[#6A38C2]' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-600 mb-1'>Jobs Posted</p>
                                <p className='text-lg font-semibold text-gray-900'>
                                    Coming Soon
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className='pt-8 border-t'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>About Company</h2>
                        <p className='text-gray-700 text-lg leading-relaxed'>
                            {singleCompany?.description || "No additional information available"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetail
