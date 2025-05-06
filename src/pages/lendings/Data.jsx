import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "bootstrap";
import Modal from "../../components/modal";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function LendingData(){
    const [lendings, setLendings] = useState([])
    const [error, setError] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        lending_id: "",
        total_good_stuff: 0,
        total_defec_stuff: 0
    });

    const [isDetailRestoration, setIsDetailRestoration] = useState([]);
    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false)
    

    const [alert, setAlert] = useState("");
    const [detailLending, setDetailLending] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLendings = lendings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(lendings.length / itemsPerPage);

    const Navigate = useNavigate();

    function handlebtnCreate(lending) {
        setDetailLending(lending);
        setFormModal({...formModal, lending_id: lending.id});
        setIsModalOpen(true);
    }

    function handlebtnDetail(restoration) {
        setIsDetailRestoration(restoration);
        // setFormDetail();
        setIsModalOpenDetail(true);
    }


    function fetchData() {
        axios.get (API_URL + "/lendings")
        .then((res) => setLendings(res.data.data))
        .catch((err) => {
            if (err.status == 401) {
                // localStorage.clear();
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                Navigate("/login")
            }
            setError(err.response.data);
        })
    }

    useEffect(() => { // tampilan awal mula web dibuka
        fetchData(); 
    }, []);


    function handleSubmitForm(e){
        e.preventDefault();
        axios.post(API_URL + "/restorations", formModal)
        .then((res) => {
            setIsModalOpen(false);
            setFormModal({
                lending_id: "",
                total_good_stuff: 0,
                total_defec_stuff: 0
            });
            setDetailLending([]);
            setAlert("success create restoration of lending");
            fetchData();
        })
        .catch((err) => {
            if (err.status == 401) {
                // localStorage.clear();
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                Navigate("/login")
            }
            setError(err.response.data);
        })
    }
    
     function exportExcel() {
                // buat format data (column) apa saja yang akan dibuat pada excel
                const formattedData = lendings.map((item,index ) => 
                ({
                    No: index + 1,
                    Name: item.name,
                    Stuff: item.stuff.name,
                    Total: item.total_stuff,
                    GoodStuff: item.restoration?. total_good_stuff,
                    DefecStuff: item.restoration?.total_defec_stuff,
                    Status: item.restoration ? "returned" : "0",
                    Date: new Date(item.created_at).toLocaleDateString('id-ID', {
                        dateStyle: 'long'
                    }),
                    DateRestoration: new Date(item.restoration?.created_at).toLocaleDateString('id-ID', {dateStyle:'long'}),
                }));
                //ubah array of object jadi worksheet Excel
                const worksheet = XLSX.utils.json_to_sheet(formattedData);
                //membuat worksheet (file)
                const workbook = XLSX.utils.book_new();
                //membuat sheets excel
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
                //mengatur format data array dan type file xlsx
                const excelBuffer = XLSX.write(workbook,{
                    bookType: "xlsx",
                    type: "array"
                });
                //simpan file dengan ekstensi2 pada type
                const file = new Blob([excelBuffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                //unduh dengan nama file
                saveAs(file, "data_inbound.xlsx");
            }
    

    return(
        <>
            {alert && <div className="alert alert-success">{alert}</div>}
            <button className="btn btn-success me-5" onClick={exportExcel}>Export Excel</button>
        <table className="table table-bordered mt-5">
            <thead>
                <tr className="fw-bold">
                    <td rowSpan={2}>#</td>
                    <td rowSpan={2}>Name</td>
                    <td colSpan={2}>Stuff</td>
                    <td rowSpan={2}>Date</td>
                    <td rowSpan={2}>Action</td>   
                </tr>
                <tr className="fw-bold">
                    <td>Name</td>
                    <td>Total</td>
                </tr>
            </thead>
            <tbody>
                {
                    currentLendings.map((item, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.stuff?.name}</td>
                            <td>{item.total_stuff}</td>
                            <td>{new Date(item.created_at).toLocaleDateString('id-ID', {dateStyle:'long'})}</td> {/* format nama bulan*/}
                            <td>
                                {
                                    item.restoration ? (<button className="btn btn-info" onClick={()=> handlebtnDetail(item)}>Detail Restoration</button>) :
                                    (<button className="btn btn-primary" onClick={()=> handlebtnCreate(item)}>Create Restoration</button>)
                                }
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
         <div className="d-flex justify-content-center mt-3"> 
                <nav>
                    <ul className="pagination mb-0">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li className={currentPage === i + 1 ? "active" : ""} key={i}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </button>
                        </li>
                    ))}
                    </ul>
                </nav>
            </div> 

        <Modal  isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="create restoration">
        {
            Object.keys(error).length > 0 ? (
            <ol className="alert alert-danger m-2 p-2">
                {
                    Object.entries(error.data).length > 0 >0 ?
                    Object.entries(error.data).map(([key, value]) => (
                        <li>{value}</li>
                    )) : error.message
                }
            </ol>
            ) : ''
        }
        <form onSubmit={handleSubmitForm}>
            <div className="alert alert-info">Lending <b>{detailLending.name}</b> with total stuff <b>{detailLending.total_stuff}</b></div>
            <div className="form-group">
                <label className="form-label">Total Good Stuff</label>
                <input type="number" className="form-control" onChange={(e) => setFormModal({...formModal, total_good_stuff: e.target.value})}/>
            </div>
            <div className="form-group">
                <label className="form-label">Total Defec Stuff</label>
                <input type="number" className="form-control" onChange={(e) => setFormModal({...formModal, total_defec_stuff: e.target.value})}/>
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
        </form>
        </Modal>

        <Modal isOpen={isModalOpenDetail} onClose={() => setIsModalOpenDetail(false)} title="create restoration">
            <ol>
                <li>Date Of Restoration: {new Date(isDetailRestoration.created_at).toLocaleDateString('id-ID', {dateStyle:'long'})}</li>
                <li>Total Item:{isDetailRestoration.total_stuff} </li>
                <li>Total Good Stuff: {isDetailRestoration.restoration?. total_good_stuff}</li>
                <li>Total Defec Stuff: {isDetailRestoration.restoration?.total_defec_stuff} </li>
            </ol>
        </Modal>
        </>
    )
}