
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new admin login page
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  return null;
};

export default Admin;
