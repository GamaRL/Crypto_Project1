import Image from "next/image";
import "tailwindcss";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Proyecto 1 Criptografía
        </h1>
        <div className="mb-6">
          <label htmlFor="username" className="block text-white mb-2">
            Nombre del usuario
          </label>
          <input
            type="text"
            id="inputUser"
            className="w-30 px-24 text-center py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
            placeholder="User"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="secret" className="block text-white mb-2">
            Secreto
          </label>
          <input
            type="text"
            id="inputSecret"
            className="w-30 px-24 text-center py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
            placeholder="Secret"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-white mb-2">
            Password
          </label>
          <input
            type="text"
            id="inputPass"
            className="w-30 px-24 text-center py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          className="block w-full rounded text-black bg-cyan-400 px-6 pb-2 pt-2.5 text-xs uppercase font-medium"
        >
          Generar llaves
        </button>

        <div className="mb-6 ">
          <label htmlFor="Arch" className="block text-white mb-2 items-center">
            Subir archivo
          </label>
          <label className="flex flex-col items-center w-full px-4 py-6 tracking-wide text-gray-700 
          uppercase bg-gray-200 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-300">
            <span className="text-base leading-normal">Seleccionar las llaves</span>
            <input type="file" className="hidden" />
          </label>
        </div>
        
      </main>
    </div>
  );
}
