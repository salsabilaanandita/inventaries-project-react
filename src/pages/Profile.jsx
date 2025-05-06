import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  // const isActive = user?.status === 1;
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="d-flex align-items-center shadow-lg p-4 bg-white rounded" style={{ width: "30rem" }}>
        
        <img
          src="https://i.pinimg.com/736x/17/91/e8/1791e89f143b29a69aa3f390351494b8.jpg"
          alt="Profile"
          className="rounded-circle border border-secondary"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />

        <div className="ms-4 text-star">
          {/* <h4 className="mb-1"> <strong>Name : </strong>{user.name}</h4> */}
          <p className="mb-2"> <strong>Username: </strong>{user.username}</p>
          <p className="mb-1"><strong>Email:</strong> {user.email}</p>
          <p className="mb-1"><strong>Password:</strong> {user.password}</p>
          <p className="mb-1"><strong>Role:</strong> {user.role}</p>
          <p className="mb-0"><strong>Status: {
           JSON.parse(localStorage.getItem("user"))?.status == 1 ? <span className="text-success fw-bold">Aktif</span>
           : <span className="text-danger fw-bold">Tidak Aktif</span>}</strong>
          </p>
          <button className="btn btn-sm btn-outline-primary mt-2">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
