import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import Modal from "../../components/modal";
//export package excel 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

export default function StuffIndex() {
    const [stuffs, setStuffs] = useState([]);
    const [error, setError] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({ name: '', type: '' });
    const [alert, setAlert] = useState("");

    const [formInbound, setFormInbound] = useState({
        stuff_id: "",
        total: 0,
        proof_file: null
    });
    const [isModalInboundOpen, setIsModalInboundOpen] = useState(false);

    const [selectedStuff, setSelectedStuff] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get(`${API_URL}/stuffs`, {
        })
            .then(res => setStuffs(res.data.data))
            //seStuffs karena dia mau menampilkan nilai, bukan mengambil
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
                setError(err.response.data);
            });
    }

    //(e) ini untuk mengambil content html
    function handleSubmitModal(e) {
        e.preventDefault();
        axios.post(`${API_URL}/stuffs`, formModal, {
            //formModal itu adalah bagian payload
        })
            .then(() => {
                setIsModalOpen(false);
                setAlert("Success add new data stuff");
                setFormModal({ name: '', type: '' });
                setError([]);
                fetchData();
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
                setError(err.response.data);
            });
    }


    function handleEditSubmit(e) {
        e.preventDefault();
        axios.patch(`${API_URL}/stuffs/${selectedStuff.id}`, formModal)
            .then(() => {
                setIsEditModalOpen(false);
                setSelectedStuff(null);
                setAlert("Success update stuff");
                setFormModal({ name: '', type: '' });
                setError([]);
                fetchData();
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
                setError(err.response.data);
            });
    }

    function handleDelete() {
        axios.delete(`${API_URL}/stuffs/${selectedStuff.id}`)
            .then(() => {
                setIsDeleteModalOpen(false);
                setSelectedStuff(null);
                setAlert("Success delete stuff");
                setError([]);
                fetchData();
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
                setError(err.response.data);
            });
    }

    function handleInboundBtn(stuffId) {
        // e.preventDefault();
        // simpan value.id yang diamnil param stuffId ke formInbound. stuff_id
        //stuff_id dari state formInbound
        //stuffId dari parameter (stuffId) dari btn -> handleInboundBtn(value.id)
        setFormInbound({ ...formInbound, stuff_id: stuffId });
        //ubah nilai state modal
        setIsModalInboundOpen(true);
    }

    function handleInboundSubmit(e) {
        e.preventDefault();
        //new FormData() : object 35 yg berfungsi sama dengan 
        const data = new FormData();
        data.append("stuff_id", formInbound.stuff_id);
        data.append("total", formInbound.total);
        data.append("proof_file", formInbound.proof_file);

        axios.post(API_URL + "/inbound-stuffs", data)
            .then(res => {
                setIsModalInboundOpen(false);
                setFormInbound({
                    stuff_id: "",
                    total: 0,
                    proof_file: null
                });
                setAlert("success add data inbound stuff!");
                fetchData();
            })
            .catch(err => {
                if (err.status === 401) {
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError(err.response.data);
            });
    }

    function exportExcel() {
        // buat format data (column) apa saja yang akan dibuat pada excel
        const formattedData = stuffs.map((item, index) =>
        ({
            No: index + 1,
            Title: item.name,
            Type: item.type,
            TotalAvailable: item.stuff_stock ? item.stuff_stock.total_available : 0,
            TotalDefec: item.stuff_stock ? item.stuff_stock.total_defec : 0,
        }));
        //ubah array of object jadi worksheet Excel
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        //membuat worksheet (file)
        const workbook = XLSX.utils.book_new();
        //membuat sheets excel
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        //mengatur format data array dan type file xlsx
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        //simpan file dengan ekstensi2 pada type
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreedsheetml.sheet"
        });
        //unduh dengan nama file
        saveAs(file, "data_stuffs.xlsx");
    }


    // Total tersedia per type
    const typeStockTotal = {
        'HTL/KLN': stuffs
            .filter(item => item.type === 'HTL/KLN')
            .reduce((sum, item) => sum + (item.stuff_stock?.total_available || 0), 0),
        'Lab': stuffs
            .filter(item => item.type === 'Lab')
            .reduce((sum, item) => sum + (item.stuff_stock?.total_available || 0), 0),
        'Sarpras': stuffs
            .filter(item => item.type === 'Sarpras')
            .reduce((sum, item) => sum + (item.stuff_stock?.total_available || 0), 0)
    };

    // Total keseluruhan semua tipe
    const totalAllTypes = Object.values(typeStockTotal).reduce((acc, val) => acc + val, 0);

    // Persentase distribusi
    const typeStockPercentage = {
        'HTL/KLN': totalAllTypes ? ((typeStockTotal['HTL/KLN'] / totalAllTypes) * 100).toFixed(2) : 0,
        'Lab': totalAllTypes ? ((typeStockTotal['Lab'] / totalAllTypes) * 100).toFixed(2) : 0,
        'Sarpras': totalAllTypes ? ((typeStockTotal['Sarpras'] / totalAllTypes) * 100).toFixed(2) : 0
    };



    return (
        <>
            {alert && <div className="alert alert-success">{alert}</div>}

            {/* <Pie
                data={{
                    labels: [
                        `HTL/KLN (${typeStockPercentage['HTL/KLN']}%)`,
                        `Lab (${typeStockPercentage['Lab']}%)`,
                        `Sarpras (${typeStockPercentage['Sarpras']}%)`
                    ],
                    datasets: [{
                        data: [
                            typeStockTotal['HTL/KLN'],
                            typeStockTotal['Lab'],
                            typeStockTotal['Sarpras']
                        ],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                }} */}

                
              <div className="card m-5" style={{ maxWidth: '400px', margin: 'auto' }}>
                            <div className="card-body">
                                <h5 className="card-title text-center">Distribusi Tipe Barang</h5>
                                <Pie
                data={{
                    labels: [
                        `HTL/KLN (${typeStockPercentage['HTL/KLN']}%)`,
                        `Lab (${typeStockPercentage['Lab']}%)`,
                        `Sarpras (${typeStockPercentage['Sarpras']}%)`
                    ],
                    datasets: [{
                        data: [
                            typeStockTotal['HTL/KLN'],
                            typeStockTotal['Lab'],
                            typeStockTotal['Sarpras']
                        ],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                }} 
                                />
            
                            </div>
                        </div>


            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-success me-3" onClick={exportExcel}>Export Excel</button>
                <button className="btn btn-primary" onClick={() => {
                    setIsModalOpen(true);
                    setFormModal({ name: '', type: '' });
                    setError([]);
                }}>
                    + ADD
                </button>
            </div>

            <table className="table table-bordered m-5">
                <thead>
                    <tr className="fw-bold">
                        <td rowSpan={2}>#</td>
                        <td rowSpan={2}>Name</td>
                        <td rowSpan={2}>Type</td>
                        <td colSpan={2}>Stock</td>
                        <td rowSpan={2}></td>
                    </tr>
                    <tr className="fw-bold">
                        <td>Available</td>
                        <td>Defec</td>
                    </tr>
                </thead>
                <tbody>
                    {stuffs.map((value, index) => {
                        const defec = value.stuff_stock ? value.stuff_stock.total_defec : "0";
                        const isDefecLow = defec < 3 && defec > 0;
                        return (
                            <tr key={value.id}>
                                <td>{index + 1}</td>
                                <td>{value.name}</td>
                                <td>{value.type}</td>
                                <td>{value.stuff_stock ? value.stuff_stock.total_available : "0"}</td>
                                <td className={isDefecLow ? "text-danger" : ""}>{defec}</td>
                                <td className="w-25">
                                    <button className="btn btn-success" onClick={() => { handleInboundBtn(value.id) }}>Add Stock</button>
                                    <button className="btn btn-info mx-2" onClick={() => {
                                        setSelectedStuff(value);
                                        setFormModal({ name: value.name, type: value.type });
                                        setIsEditModalOpen(true);
                                        setError([]);
                                    }}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger" onClick={() => {
                                        setSelectedStuff(value);
                                        setIsDeleteModalOpen(true);
                                        setError([]);
                                    }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* ADD MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Stuff">
                {/* onClose={() => setIsModalOpen(false)} ini di gunakan ketika mau mengirim argumen harus menggunakan arrow => dan jika tidak langsung saja panggil function nya*/}
                <form onSubmit={handleSubmitModal}>
                    {error.data
                        ? Object.entries(error.data).map(([key, value]) => <div key={key}>{value}</div>)
                        : <div>{error.message || "Something went wrong."}</div>}
                    <div className="form-group">
                        <label className="form-label">Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={formModal.name}
                            onChange={(e) => setFormModal({ ...formModal, name: e.target.value })}
                        />
                        {/* ...formModal = ... adalah speed operator yang berfungsi unutuk mengeluarkan objek atau nilai array*/}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Type <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            value={formModal.type}
                            onChange={(e) => setFormModal({ ...formModal, type: e.target.value })}
                        >
                            {/* <option value="">-- Select Type --</option> */}
                            <option value="HTL/KLN">HTL/KLN</option>
                            <option value="Lab">Lab</option>
                            <option value="Sarpras">Sarpras</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">ADD</button>
                </form>
            </Modal>

            {/* EDIT MODAL */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Stuff">
                <form onSubmit={handleEditSubmit}>
                    {error && (
                        <div className="alert alert-danger text-danger m-2 p-2">
                            {error.data
                                ? Object.entries(error.data).map(([key, value]) => <div key={key}>{value}</div>)
                                : <div>{error.message || "Something went wrong."}</div>}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={formModal.name}
                            onChange={(e) => setFormModal({ ...formModal, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Type <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            value={formModal.type}
                            onChange={(e) => setFormModal({ ...formModal, type: e.target.value })}
                        >
                            <option value="">-- Select Type --</option>
                            <option value="HTL/KLN">HTL/KLN</option>
                            <option value="Lab">Lab</option>
                            <option value="Sarpras">Sarpras</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">UPDATE</button>
                </form>
            </Modal>

            {/* DELETE MODAL */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Stuff">
                <p>Are you sure want to delete <strong>{selectedStuff?.name}</strong>?</p>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary mx-2" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </Modal>

            <Modal isOpen={isModalInboundOpen} onClose={() => setIsModalInboundOpen(false)} title="Add Stock">
                {/* onClose={() => setIsModalOpen(false)} ini di gunakan ketika mau mengirim argumen harus menggunakan arrow => dan jika tidak langsung saja panggil function nya*/}
                <form onSubmit={handleInboundSubmit}>
                    {
                        Object.keys(error).length > 0 ? (
                            <ol className="alert alert-danger m-2 p-2">
                                {
                                    Object.entries(error.data).length > 0 > 0 ?
                                        Object.entries(error.data).map(([key, value]) => (
                                            <li>{value}</li>
                                        )) : error.message
                                }
                            </ol>
                        ) : ''
                    }
                    <div className="mb-3 d-flex flex-column justify-content-start">
                        <label className="form-label">Total Item <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            // value={formModal.name}
                            onChange={(e) => setFormInbound({ ...formInbound, total: e.target.value })}
                        />
                        {/* ...formModal = ... adalah speed operator yang berfungsi unutuk mengeluarkan objek atau nilai array*/}
                    </div>
                    <div className="mb-3 d-flex flex-column justify-content-start">
                        <label className="form-label">Proof Image <span className="text-danger">*</span></label>
                        <input
                            className="form-control" type="file"
                            // value={formModal.type}
                            onChange={(e) => setFormInbound({ ...formInbound, proof_file: e.target.files[0] })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Add Stock</button>
                </form>
            </Modal>
        </>
    );
}
