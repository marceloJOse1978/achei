import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import imageName from "../../../../assets/image/logo-bg.png";
import "./ModalRegister";
import ModalRegister from "./ModalRegister";
/* import { CREATE_USER_ACCOUNT } from "./RegisterReq"; */
import { useMutation } from "@tanstack/react-query";
import { CREATE_ACCOUNT } from "../../../../lib/API";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";


export default function Register() {
  // Estado para os campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);

  const { mutateAsync: createRegister, isPending } = useMutation({
    mutationFn: CREATE_ACCOUNT,
    onSuccess(data) {
      console.log("onSuccess ", data);
      setSubmit(true);
      window.localStorage.setItem("data-aready", JSON.stringify(data));
    },
    onError(error) {
      toast.error("O Email já existe");
      console.log("onError ", error);
    },
  });
  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (refresh da página)

    // Validação simples das senhas
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (name.length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres.");
      return;
    }

    try {
      createRegister({ name, email, password });
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      setError("Ocorreu um erro ao criar a conta.");
    }
  };

  return (
    <div className="register-container">
      <ModalRegister email={email} submit={submit} setSubmit={setSubmit} />
      <div className="register">
        <div className="publicidade">
          <img src={imageName} alt="" className="image-name" />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Comece Agora</h1>
          {error && <p className="text-xs text-red-800 error">{error}</p>}{" "}
          {/* Mostra a mensagem de erro, se houver */}
          <div className="form-group">
            <label htmlFor="new-user-name">
              <i className="bi bi-person bi-left"></i>
            </label>
            <input
              type="text"
              name="name"
              id="new-user-name"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)} // Atualiza o estado
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-user-email">
              <i className="bi bi-envelope bi-left"></i>
            </label>
            <input
              type="email"
              name="email"
              required
              id="new-user-email"
              placeholder="Digite o seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-user-pass">
              <i className="bi bi-person-lock bi-left"></i>
            </label>
            <input
              type="password"
              name="new-pass"
              id="new-user-pass"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-user-confirm">
              <i className="bi bi-person-lock bi-left"></i>
            </label>
            <input
              type="password"
              id="new-user-confirm"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Atualiza o estado
            />
          </div>
          <div className="form-group terms">
            <input type="checkbox" name="" id="new-user-terms" required />
            <label htmlFor="new-user-terms">
              Concordo com os <Link to="">Termos</Link> e{" "}
              <Link to="">Políticas de privacidade</Link>.
            </label>
          </div>
          <div className="form-group ">
            {/* <Link to="/confirm"> */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 btn"
              id="btn-submit-register"
            >
              Avançar{" "}
              {isPending && <Loader2 className="animate-spin" size={14} />}
            </button>
            {/* </Link> */}
          </div>
          <div className="space"></div>
          <div className="contact-area">
            <div className="contact-top">
              <i className="bi bi-shield-check"></i>
              <p>Entre em contato!</p>
            </div>
            <p className="contact-text">
              Contacte-nos em casos de dúvidas. Fale conosco para esclarecer
              qualquer dúvida, obter informações adicionais ou discutir suas
              necessidades.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
