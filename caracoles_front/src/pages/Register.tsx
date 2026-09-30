import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const usersStr = localStorage.getItem('mock_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    if (users.find((u: any) => u.correo === correo)) {
      toast.error('El correo ya está registrado');
      return;
    }

    users.push({
      id: uuidv4(),
      nombre_completo: nombre,
      correo,
      password
    });
    localStorage.setItem('mock_users', JSON.stringify(users));
    toast.success('Registro exitoso. Ahora inicia sesión.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="split-left">
        <div className="text-white text-center">
          <h1 className="text-5xl font-bold mb-6">Únete a la Carrera</h1>
          <p className="text-xl text-blue-100">Crea tu cuenta y comienza a gestionar tu saldo para apostar.</p>
        </div>
      </div>

      <div className="split-right">
        <div className="w-full max-w-md card">
          <h2 className="title-text">Registrarse</h2>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="label-text">Nombre completo</label>
              <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)}
                className="input-field" placeholder="Nombre completo" />
            </div>
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
            <div>
              <label className="label-text">Confirmar contraseña</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="input-field" placeholder="Confirmar contraseña" />
            </div>
            <button type="submit" className="btn-primary mt-4">
              Crear cuenta
            </button>
          </form>
          <p className="mt-8 text-center text-gray-600">
            ¿Ya tienes cuenta? <Link to="/" className="text-blue-600 font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
