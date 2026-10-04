import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'


const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const filteredCompany = companies.length >= 0 && companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])

    const deleteCompanyHandler = async (companyId) => {
        // Ask for confirmation
        if (!window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                // Refresh the page or update state
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete company");
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id} className="cursor-pointer hover:bg-gray-100 transition">
                                <TableCell>
                                    <Avatar className="cursor-pointer hover:opacity-80 transition" onClick={() => navigate(`/admin/companies/${company._id}`)}>
                                        <AvatarImage src={company.logo}/>
                                        <AvatarFallback>{company?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell 
                                    className="font-medium hover:text-[#6A38C2] transition cursor-pointer"
                                    onClick={() => navigate(`/admin/companies/${company._id}`)}
                                >
                                    {company.name}
                                </TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal className="cursor-pointer ml-auto" /></PopoverTrigger>
                                        <PopoverContent className="w-48 p-2">
                                            <div className='flex flex-col gap-2'>
                                                {/* Edit Option */}
                                                <div 
                                                    onClick={()=> navigate(`/admin/companies/${company._id}`)} 
                                                    className='flex items-center gap-2 w-fit cursor-pointer hover:bg-gray-100 p-2 rounded transition text-gray-700 hover:text-[#6A38C2]'
                                                >
                                                    <Edit2 className='w-4 h-4' />
                                                    <span className='font-medium'>Edit</span>
                                                </div>

                                                {/* Delete Option */}
                                                <div 
                                                    onClick={() => deleteCompanyHandler(company._id)} 
                                                    className='flex items-center gap-2 w-fit cursor-pointer hover:bg-red-50 p-2 rounded transition text-red-600 hover:text-red-700'
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                    <span className='font-medium'>Delete</span>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>

                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable