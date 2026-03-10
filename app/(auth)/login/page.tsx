"use client";
import Image from "next/image";
import { useState } from "react";
import { BsDoorOpen } from "react-icons/bs";

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const sendLogin = () => {
    }

  return (
    <>
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <p>APPEAR</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col gap-8 justify-center w-full max-w-md">
          <div className="flex gap-4 items-center">
            <Image
              src="/next.svg"
              height={100}
              width={100}
              alt="logo-img"
              className="lg:hidden"
            />
            <h1 className="text-xl font-semibold">MoviMenta</h1>
          </div>
          <div className="grid gap-2 border-b border-gray-400 pb-2">
            <h2 className="text-2xl font-bold">Bem-vindo de volta</h2>
            <p className="opacity-60">
              Entre com suas credenciais para acessar o painel
            </p>
          </div>
          <form className="items-center space-y-4" onSubmit={sendLogin}>
            <div className="grid gap-2">
              <label htmlFor="email-input">E-mail</label>
              <input
                id="email-input"
                type="email"
                className="border border-gray-300 rounded-lg p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="pwd-input">Senha</label>
              <input
                id="pwd-input"
                type="password"
                className="border border-gray-300 rounded-lg p-2 "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-(--azul) text-white w-full rounded-lg p-2 flex items-center justify-center gap-4"
            >
              Entrar <BsDoorOpen />
            </button>
          </form>
          <p className="opacity-60">
            Sem acesso? Entre em contato com a sua corretora.
          </p>
        </div>
      </div>
    </>
  );
}
