import { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {

  // Paksa hilangkan scroll dari body & html
  // useEffect(() => {
  //   document.body.style.margin = "0";
  //   document.body.style.overflow = "hidden";
  //   document.documentElement.style.overflow = "hidden";
  // }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
      className="bg-light d-flex align-items-center"
    >
      <div className="container-fluid px-5">
        <div className="row align-items-center min-vh-100">

          {/* TEXT */}
          <div className="col-lg-6">
            <h1 className="fw-bold display-4 mb-3">
              Welcome to <span className="text-primary">Inventaris App</span>
            </h1>

            <p className="lead text-muted mb-4">
              Sistem manajemen inventaris modern untuk mengelola barang,
              peminjaman, dan data masuk dengan mudah dan cepat.
            </p>

            <div className="d-flex gap-3">
              <Link to="/login" className="btn btn-primary btn-lg">
                Get Started
              </Link>

              <Link to="/dashboard" className="btn btn-outline-primary btn-lg">
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* IMAGE */}
          <div className="col-lg-6 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891419.png"
              alt="Inventory"
              className="img-fluid"
              style={{ maxWidth: "400px" }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}