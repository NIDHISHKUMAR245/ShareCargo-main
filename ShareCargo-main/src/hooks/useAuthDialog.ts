import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { getStoredUser } from "./useAuth";

export function useAuthDialog() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleStartShipment = useCallback(() => {
    const user = getStoredUser();
    if (!user) {
      setShowDialog(true);
    } else {
      navigate("/book");
    }
  }, [navigate]);

  const handleLogin = useCallback(() => {
    setShowDialog(false);
    navigate("/auth");
  }, [navigate]);

  const handleSignup = useCallback(() => {
    setShowDialog(false);
    navigate("/auth");
  }, [navigate]);

  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, []);

  return {
    showDialog,
    handleStartShipment,
    handleLogin,
    handleSignup,
    handleClose,
  };
}
