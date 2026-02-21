import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center shadow-sm">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">

            {/* Header */}
            <div className="bg-primary text-white text-center py-4 position-relative">
              <img
                src="https://i.pinimg.com/736x/17/91/e8/1791e89f143b29a69aa3f390351494b8.jpg"
                alt="Profile"
                className="rounded-circle border border-4 border-white shadow"
                width="130"
                height="130"
                style={{ objectFit: "cover", marginBottom: "-65px" }}
              />
            </div>

            {/* Body */}
            <div className="card-body pt-5 px-4">

              <div className="text-center mb-4">
                <h4 className="fw-bold mb-1">{user.username}</h4>
                <p className="text-muted mb-2">{user.email}</p>

                {user.status === 1 ? (
                  <span className="badge bg-success px-3 py-2">
                    Active
                  </span>
                ) : (
                  <span className="badge bg-danger px-3 py-2">
                    Inactive
                  </span>
                )}
              </div>

              <hr />

              <div className="row g-4 mt-2">

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light">
                    <small className="text-muted">Username</small>
                    <div className="fw-semibold">{user.username}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light">
                    <small className="text-muted">Email</small>
                    <div className="fw-semibold">{user.email}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light">
                    <small className="text-muted">Password</small>
                    <div className="fw-semibold">•••</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light">
                    <small className="text-muted">Role</small>
                    <div className="fw-semibold text-capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>

              </div>

              {/* <div className="text-end mt-4">
                <button className="btn btn-primary px-4 shadow-sm">
                  Edit Profile
                </button>
              </div> */}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}