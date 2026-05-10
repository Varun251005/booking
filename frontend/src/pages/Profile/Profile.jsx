import { useMemo } from "react";
import { Card, Container } from "react-bootstrap";

const Profile = () => {
  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const role = localStorage.getItem("role") || localStorage.getItem("userRole") || "user";

  return (
    <Container className="mt-4 page-shell">
      <h2 className="page-title">My Profile</h2>
      <Card className="mt-3">
        <Card.Body>
          <p><strong>Name:</strong> {user?.name || "-"}</p>
          <p><strong>Email:</strong> {user?.email || "-"}</p>
          <p className="mb-0"><strong>Role:</strong> {role}</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
