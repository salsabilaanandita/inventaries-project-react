import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constant";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [inbounds, setInbounds] = useState([]);
  const [lendings, setLendings] = useState([]);
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
      });

    axios.get(API_URL + "/lendings")
      .then(res => setLendings(res.data.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      });
  }

  // ====== HITUNG DATA ======

  const totalInbound = inbounds.reduce((sum, item) => sum + item.total, 0);
  const totalLending = lendings.length;
  const totalDipinjam = lendings.filter(l => !l.restoration).length;
  const totalReturned = lendings.filter(l => l.restoration).length;

  // ====== DATA CHART ======

  const chartData = {
    labels: ["Borrowed", "Returned"],
    datasets: [
      {
        label: "Lending Status",
        data: [totalDipinjam, totalReturned],
        backgroundColor: ["#ffc107", "#198754"],
      },
    ],
  };

  // ====== TOP 5 BARANG PALING SERING DIPINJAM ======

  const stuffCount = {};

  lendings.forEach(item => {
    const name = item.stuff?.name;
    if (name) {
      stuffCount[name] = (stuffCount[name] || 0) + 1;
    }
  });

  const sortedStuff = Object.entries(stuffCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">

      <h2 className="fw-bold mb-4">Dashboard Overview</h2>

      {/* STAT CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total Inbound Item</h6>
            <h3 className="fw-bold text-primary">{totalInbound}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total Lending</h6>
            <h3 className="fw-bold text-info">{totalLending}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Currently Borrowed</h6>
            <h3 className="fw-bold text-warning">{totalDipinjam}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Returned</h6>
            <h3 className="fw-bold text-success">{totalReturned}</h3>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body">
          <h5 className="mb-3">Lending Status Chart</h5>
          <Bar data={chartData} />
        </div>
      </div>

      {/* TABLE TOP 5 */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">Top 5 Most Borrowed Stuff</h5>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Stuff Name</th>
                <th>Total Borrowed</th>
              </tr>
            </thead>
            <tbody>
              {sortedStuff.map(([name, total], index) => (
                <tr key={index}>
                  <td>{name}</td>
                  <td>{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}