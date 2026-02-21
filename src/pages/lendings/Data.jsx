import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function LendingData() {
    const [lendings, setLendings] = useState([]);
    const [error, setError] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        lending_id: "",
        total_good_stuff: 0,
        total_defec_stuff: 0
    });
    const [isDetailRestoration, setIsDetailRestoration] = useState([]);
    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
    const [alert, setAlert] = useState("");
    const [detailLending, setDetailLending] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLendings = lendings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(lendings.length / itemsPerPage);

    const navigate = useNavigate();

    function handlebtnCreate(lending) {
        setDetailLending(lending);
        setFormModal({ ...formModal, lending_id: lending.id });
        setIsModalOpen(true);
    }

    function handlebtnDetail(restoration) {
        setIsDetailRestoration(restoration);
        setIsModalOpenDetail(true);
    }

    function fetchData() {
        axios.get(API_URL + "/lendings")
            .then((res) => setLendings(res.data.data))
            .catch((err) => {
                if (err.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError(err.response?.data || {});
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    function handleSubmitForm(e) {
        e.preventDefault();
        axios.post(API_URL + "/restorations", formModal)
            .then(() => {
                setIsModalOpen(false);
                setFormModal({
                    lending_id: "",
                    total_good_stuff: 0,
                    total_defec_stuff: 0
                });
                setDetailLending([]);
                setAlert("Success create restoration of lending");
                fetchData();
            })
            .catch((err) => {
                if (err.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                setError(err.response?.data || {});
            });
    }

    function exportExcel() {
        const formattedData = lendings.map((item, index) => ({
            No: index + 1,
            Name: item.name,
            Stuff: item.stuff?.name,
            Total: item.total_stuff,
            GoodStuff: item.restoration?.total_good_stuff || 0,
            DefecStuff: item.restoration?.total_defec_stuff || 0,
            Status: item.restoration ? "Returned" : "Borrowed",
            Date: new Date(item.created_at).toLocaleDateString("id-ID", { dateStyle: "long" }),
            DateRestoration: item.restoration?.created_at
                ? new Date(item.restoration.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })
                : "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lending Data");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        saveAs(file, "data_lending.xlsx");
    }

    return (
        <div className="container mt-4">

            {alert && (
                <div className="alert alert-success shadow-sm">
                    {alert}
                </div>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">Lending Data</h4>
                <button
                    className="btn btn-success shadow-sm px-4"
                    onClick={exportExcel}
                >
                    Export Excel
                </button>
            </div>

            {/* Card Table */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-center">
                                <tr>
                                    <th rowSpan={2}>#</th>
                                    <th rowSpan={2}>Name</th>
                                    <th colSpan={2}>Stuff</th>
                                    <th rowSpan={2}>Date</th>
                                    <th rowSpan={2}>Action</th>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLendings.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.stuff?.name}</td>
                                        <td className="text-center">{item.total_stuff}</td>
                                        <td>
                                            {new Date(item.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
                                        </td>
                                        <td className="text-center">
                                            {item.restoration ? (
                                                <button
                                                    className="btn btn-info btn-sm px-3"
                                                    onClick={() => handlebtnDetail(item)}
                                                >
                                                    Detail
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-sm px-3"
                                                    onClick={() => handlebtnCreate(item)}
                                                >
                                                    Create
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                            key={i}
                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal Create */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Restoration">
                <form onSubmit={handleSubmitForm}>
                    <div className="alert alert-info">
                        Lending <b>{detailLending.name}</b> with total stuff <b>{detailLending.total_stuff}</b>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Total Good Stuff</label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setFormModal({ ...formModal, total_good_stuff: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Total Defec Stuff</label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setFormModal({ ...formModal, total_defec_stuff: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Create
                    </button>
                </form>
            </Modal>

            {/* Modal Detail */}
            <Modal isOpen={isModalOpenDetail} onClose={() => setIsModalOpenDetail(false)} title="Detail Restoration">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        Date: {new Date(isDetailRestoration.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
                    </li>
                    <li className="list-group-item">
                        Total Item: {isDetailRestoration.total_stuff}
                    </li>
                    <li className="list-group-item">
                        Good Stuff: {isDetailRestoration.restoration?.total_good_stuff}
                    </li>
                    <li className="list-group-item">
                        Defec Stuff: {isDetailRestoration.restoration?.total_defec_stuff}
                    </li>
                </ul>
            </Modal>

        </div>
    );
}