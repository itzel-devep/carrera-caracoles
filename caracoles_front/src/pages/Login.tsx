import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const usersStr = localStorage.getItem('mock_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const user = users.find((u: any) => u.correo === correo && u.password === password);
    if (user) {
      toast.success(`¡Bienvenido ${user.nombre_completo}!`);
      login({ id: user.id, nombre_completo: user.nombre_completo, correo: user.correo });
      navigate('/dashboard');
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="split-left">
        <div className="text-white text-center">
          <h1 className="text-5xl font-bold mb-6">Carrera de Caracoles</h1>
          <p className="text-xl text-blue-100">La mejor plataforma para gestionar tus apuestas y victorias.</p>
        </div>
      </div>

      <div className="split-right">
        <div className="w-full max-w-md card">
          <h2 className="title-text">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="label-text">Correo electrónico</label>
              <input type="email" required value={correo} onChange={e => setCorreo(e.target.value)}
                className="input-field" placeholder="Correo electrónico" />
            </div>
            <div>
              <label className="label-text">Contraseña</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="input-field" placeholder="Contraseña" />
            </div>
            <button type="submit" className="btn-primary mt-4">
              Ingresar
            </button>
          </form>
          <p className="mt-8 text-center text-gray-600">
            ¿No tienes cuenta? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
