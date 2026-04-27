import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import API from "../../services/api";

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFoods = async () => {
    try {
      setError("");
      const response = await API.get("/foods");
      setFoods(response.data ?? []);
    } catch {
      setError("Could not load foods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const handleDelete = async (foodId) => {
    const confirmed = window.confirm("Delete this food item?");

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(`/foods/${foodId}`);
      setFoods((prevFoods) => prevFoods.filter((item) => item._id !== foodId));
    } catch {
      alert("Failed to delete food item.");
    }
  };

  return (
    <Container className="mt-4 page-shell admin-shell">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="page-title m-0">Manage Foods</h2>
        <Button className="theme-btn-sm" onClick={loadFoods}>Refresh</Button>
      </div>

      {loading ? (
        <p className="status-text">Loading foods...</p>
      ) : error ? (
        <p className="status-text error-text">{error}</p>
      ) : (
        <Table bordered hover responsive className="admin-table align-middle mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th style={{ width: "140px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id ?? food.id}>
                <td>{food.name}</td>
                <td>₹{food.price}</td>
                <td>{food.category || "-"}</td>
                <td>
                  <Button
                    className="theme-btn-sm"
                    onClick={() => handleDelete(food._id ?? food.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminFoods;
