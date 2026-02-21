import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constant";
import Modal from "../../components/modal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Lendings() {
  const [stuffs, setStuffs] = useState([]);
  const [error, setError] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formModal, setFormModal] = useState({
    stuff_id: "",
    name: "",
    total_stuff: 0,
    note: "",
  });

  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios
      .get(API_URL + "/stuffs")
      .then((res) => setStuffs(res.data.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        setError(err.response?.data || "Something went wrong");
      });
  }

  function handleBtn(stuffid) {
    setFormModal({ ...formModal, stuff_id: stuffid });
    setIsModalOpen(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    axios
      .post(API_URL + "/lendings", formModal)
      .then(() => {
        setIsModalOpen(false);
        setFormModal({
          stuff_id: "",
          name: "",
          total_stuff: 0,
          note: "",
        });
        setAlert("Success add new lending");
        fetchData();
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        setError(err.response?.data || "Something went wrong");
      });
  }

  return (
    <div className="container py-5">

      {alert && <div className="alert alert-success">{alert}</div>}

      <h3 className="fw-bold mb-4">Available Stuffs</h3>

      <div className="row g-4">
        {stuffs.map((item, index) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
            <div className="card shadow-sm border-0 h-100">

              <div className="card-body d-flex flex-column">

                <h5 className="card-title fw-bold mb-2">
                  {item.name}
                </h5>

                <p className="text-muted mb-3">
                  Total Available:{" "}
                  <span className="fw-semibold">
                    {item.stuff_stock
                      ? item.stuff_stock.total_available
                      : 0}
                  </span>
                </p>

                <div className="mt-auto">
                  <button
                    className={`btn w-100 ${
                      item.stuff_stock &&
                      item.stuff_stock.total_available
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                    disabled={
                      !(item.stuff_stock &&
                        item.stuff_stock.total_available)
                    }
                    onClick={() => handleBtn(item.id)}
                  >
                    {item.stuff_stock &&
                    item.stuff_stock.total_available
                      ? "Select"
                      : "Stock Not Available"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Lending"
      >
        {error && typeof error === "string" && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) =>
                setFormModal({
                  ...formModal,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Total Stuff <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              required
              onChange={(e) =>
                setFormModal({
                  ...formModal,
                  total_stuff: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Note <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) =>
                setFormModal({
                  ...formModal,
                  note: e.target.value,
                })
              }
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Process
          </button>
        </form>
      </Modal>

    </div>
  );
}