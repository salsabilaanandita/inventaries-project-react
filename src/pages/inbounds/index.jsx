import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import Modal from "../../components/modal";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Tambahkan ini untuk chart
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InboundIndex() {
    const [error, setError] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alert, setAlert] = useState("");
    const [inbounds, setInbounds] = useState([]);
    const [selectedInbound, setSelectedInbound] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get(API_URL + "/inbound-stuffs")
            .then(res => setInbounds(res.data.data))
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
                setError(err.response.data);
            });
    }

    function handleDelete() {
        axios.delete(API_URL + "/inbound-stuffs/" + selectedInbound.id)
            .then(() => {
                setIsDeleteModalOpen(false);
                setSelectedInbound(null);
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

    function exportExcel() {
        const formattedData = inbounds.map((item, index) => ({
            No: index + 1,
            Stuff: item.stuff.name,
            Total: item.total,
            ProofFile: item.proof_file,
            Date: new Date(item.created_at).toLocaleDateString('id-ID', {
                dateStyle: 'long'
            })
        }));
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        saveAs(file, "data_inbound.xlsx");
    }

    // Total keseluruhan
    const totalSum = inbounds.reduce((sum, item) => sum + item.total, 0);

    // Akumulasi total per tipe
    const typeTotal = {
        'HTL/KLN': inbounds.filter(item => item.stuff.type === 'HTL/KLN').reduce((sum, item) => sum + item.total, 0),
        'Lab': inbounds.filter(item => item.stuff.type === 'Lab').reduce((sum, item) => sum + item.total, 0),
        'Sarpras': inbounds.filter(item => item.stuff.type === 'Sarpras').reduce((sum, item) => sum + item.total, 0)
    };

    // Persentase dari masing-masing tipe
    const typePercentage = {
        'HTL/KLN': totalSum ? ((typeTotal['HTL/KLN'] / totalSum) * 100).toFixed(2) : 0,
        'Lab': totalSum ? ((typeTotal['Lab'] / totalSum) * 100).toFixed(2) : 0,
        'Sarpras': totalSum ? ((typeTotal['Sarpras'] / totalSum) * 100).toFixed(2) : 0
    };


    return (
        <>
            {alert && <div className="alert alert-success">{alert}</div>}

            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-success me-3" onClick={exportExcel}>Export Excel</button>
            </div>

            <div className="card m-5" style={{ maxWidth: '400px', margin: 'auto' }}>
                <div className="card-body">
                    <h5 className="card-title text-center">Distribusi Tipe Barang</h5>
                    <Pie
                        data={{
                            labels: [
                                `HTL/KLN (${typePercentage['HTL/KLN']}%)`,
                                `Lab (${typePercentage['Lab']}%)`,
                                `Sarpras (${typePercentage['Sarpras']}%)`
                            ],
                            datasets: [{
                                data: [typeTotal['HTL/KLN'], typeTotal['Lab'], typeTotal['Sarpras']],
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                            }]
                        }}
                    />

                </div>
            </div>

            <table className="table table-bordered m-5">
                <thead>
                    <tr className="fw-bold">
                        <td rowSpan={2}>No</td>
                        <td rowSpan={2}>Stuff</td>
                        <td rowSpan={2}>Total New Item</td>
                        <td rowSpan={2}>Proof File</td>
                        <td rowSpan={2}>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {inbounds.map((value, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{value.stuff.name}</td>
                            <td>{value.total}</td>
                            <td>
                                {value.proof_file ? (
                                    <a href={value.proof_file} target="_blank" rel="noopener noreferrer">
                                        <img className="w-50 d-block mt-2" src={value.proof_file} height={100} width={100} alt="Proof" />
                                    </a>
                                ) : ''}
                            </td>
                            <td className="w-25">
                                <button className="btn btn-danger" onClick={() => {
                                    setSelectedInbound(value);
                                    setIsDeleteModalOpen(true);
                                    setError([]);
                                }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Stuff">
                <p>Are you sure want to delete <strong>{selectedInbound?.stuff.name}</strong>?</p>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary mx-2" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </Modal>
        </>
    );
}
