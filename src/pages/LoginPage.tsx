import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader } from "../components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, saveLocalStorageToken } from "../lib/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useUserContext } from "@/hooks/UserContext";
import React, { useState, useEffect } from "react";
import { BASE_URL, APP_NAME, removeLocalStorageToken } from "../lib/API";

const schema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});
type schemaType = z.infer<typeof schema>;

export default function LoginPage() {
  const [ip, setIP] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  useEffect(() => {
  
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIP(data.ip); // Armazena o IP no estado
        console.log("Endereço IP público do usuário:", data.ip); // Emite o IP no console
      } catch (error) {
        console.error("Erro ao obter o endereço IP:", error);
      }
    };
    fetchIP();
    if (user) {
      navigate("/portal");
    }
  }, [user]);
  console.log(user);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  /*   const raw = {
    "student_id":2,
    "classroom_id":1,
    "user_id":1,
    "ip": data.ip
} */

  /*  fetch("http://server-app.quote360.ao/api/auditSetting", 
    body:raw
  )
    .then((response) => response.json())
    .then((data) => {
    console.log(data.ip));
 */

  const { mutateAsync: sign, isPending: isPendingCreate } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log(data); // Exibe dados de login
      if (data.token) {
        console.log(data)
        saveLocalStorageToken(data.token);

       
        toast.success("Sessão iniciada com sucesso");
        navigate("/portal");

      
        // Pega os dados dos estudantes
        const token = localStorage.getItem(`${APP_NAME}_`);
        const response = await fetch(`${BASE_URL}/students/get-data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const profilesData = await response.json();
        setUser({ id: data.user_id, name: data.user_name, email: data.user_email, student_id: profilesData[0]?.id });
        console.log("Dados dos estudantes:", profilesData); // Exibe dados dos estudantes no console
        const AUTH_TOKEN = window.localStorage.getItem(`${APP_NAME}_`);
        console.log("Token de autenticação:", AUTH_TOKEN);

        // Obtém a data e a hora atuais
        const currentDate = new Date();
        const date = currentDate.toISOString().split("T")[0]; // Formato: YYYY-MM-DD
        const time = currentDate.toTimeString().split(" ")[0]; // Formato: HH:MM:SS
console.log(ip)
        // Faz a requisição para `auditSetting` após o login bem-sucedido
        fetch("https://server-app.quote360.ao/api/loginPoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ip: ip,
            token: data.token,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Resposta da audit login:", data);
          })
          .catch((error) => console.error("Erro ao enviar audit loguin:", error));
      } else {
        toast.error("Nao foi possivel iniciar sessão");
      }
    },
    onError(error) {
      toast.error("Nao foi possivel iniciar sessão");
      console.log(error);
    },
  });

  const onSubmit = (data: schemaType) => {
    console.log(data);
    sign(data);
  };

  return (
    <div className="flex items-start min-h-screen">
      <div className="relative w-0 overflow-hidden md:flex-1 bg-[url(login.jpg)] h-screen  brightness-50 flex justify-center items-center">
        <h1 className="absolute text-6xl font-extrabold text-white">
          Bem vindo de volta!
        </h1>
      </div>

      <div className="w-full flex flex-col p-8 md:w-[500px]">
        <header>
          <h1 className="font-mono font-extralight">SFFS TREINING</h1>
        </header>
        <h2 className="my-4 text-2xl font-extrabold text-muted-foreground">
          Acesse sua conta
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              type="text"
              placeholder="Digite seu e-mail"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500">
                {String(errors.email.message)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="password" className="text-muted-foreground">
              Palavra-passe
            </Label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-500">
                {String(errors.password.message)}
              </span>
            )}
          </div>
          <div>
            <Link to="" className="text-sm text-sky-700 text-bold">
              Esqueci minha senha
            </Link>
          </div>
          <div className="flex flex-col w-full mt-2">
            <Button
              className="flex items-center justify-center transition-colors bg-blue-700 hover:bg-blue-900"
              type="submit"
            >
              Entrar {isPendingCreate && <Loader2 className="animate-spin" />}
            </Button>
          </div>

          <Card className="mt-4">
            <CardHeader className="flex items-center justify-center">
              <div>
                <Link to="/" className="text-sm text-foreground">
                  Não tem ainda uma conta?{" "}
                  <span className="text-violet-800">Inscreve-se</span>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </form>
      </div>
    </div>
  );
}
