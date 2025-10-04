import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[380px]"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>

          <form className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 rounded-xl shadow-md hover:opacity-90 transition"
            >
              {isLogin ? "Entrar" : "Registrarse"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
            <span
              className="text-indigo-500 font-semibold cursor-pointer hover:underline"
              onClick={toggleMode}
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
