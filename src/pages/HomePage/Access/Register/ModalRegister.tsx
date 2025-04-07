import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import "./styles.css";
import "./Modal.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { saveLocalStorageToken, SUBMIT_CODE_VERIFY,SUBMIT_RECODE } from "../../../../lib/API";
import { UserContext, useUserContext } from "@/hooks/UserContext";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ModalRegister = ({
  submit,
  setSubmit,
  email,
}: {
  submit: boolean;
  setSubmit: (state: boolean) => void;
  email: string;
}) => {
  const navigate = useNavigate();
  const [code, setCode] = React.useState("");
  const { setUser } = useUserContext();
  const { mutateAsync: createRegister, isPending } = useMutation({
    mutationFn: SUBMIT_CODE_VERIFY,
    onSuccess(data: any) {
      toast.success("Email confirmado com sucesso");
      console.log("onSuccess ", data);
      saveLocalStorageToken(data.token);
      setUser(data.student);
      navigate("/portal");
    },
    onError(error) {
      toast.error("NCodigo invalido");
      console.log("onError ", error);
    },
  });

  const { mutateAsync: resendCode, isPending: isPendingResend } = useMutation({
    mutationFn: SUBMIT_RECODE,
    onSuccess(data: any) {
      toast.success("Código reenviado com sucesso");
      console.log("onSuccess ", data);
    },
    onError(error) {
      toast.error("Erro ao reenviar o código");
      console.log("onError ", error);
    },
  });

  function handleSubmit() {
    if (code.length < 6) {
      toast.error("Codigo invalido");
      return;
    }
    createRegister({ email, code });
  }

  function handleResendCode() {
    resendCode({ email });
    toast.info("Código reenviado para o email.");
  }

  const [timer, setTimer] = React.useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  

  return (
    <Dialog.Root open={submit} onOpenChange={setSubmit}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          className="DialogContent"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title className="DialogTitle">Confirmar o Email</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Digite abaixo o código enviado no seu email
          </Dialog.Description>
          <fieldset className="Fieldset">
            <input
              className="Input"
              id="name"
              placeholder="Digite o código aqui."
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}
            />
          </fieldset>
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 btn-confirm Button green"
          >
            Confirmar
            {isPending && <Loader2 className="animate-spin" size={14} />}
          </button>

            <button
            onClick={() => {
              if (timer === 0) {
              setTimer(30); // Define o tempo de contagem regressiva
              handleResendCode(); // Função para reenviar o código
              }
            }}
            className="flex items-center justify-center gap-2 btn-confirm Button"
            style={{
              backgroundColor: timer === 0 ? "#f2f2f2" : "#d3d3d3",
              color: timer === 0 ? "#000" : "#888",
              cursor: timer === 0 ? "pointer" : "not-allowed",
            }}
            disabled={timer !== 0}
            >
            {timer === 0 ? "reenviar código" : `Aguarde ${timer}s`}
            {isPending && <Loader2 className="animate-spin" size={14} />}
            </button>

          <Dialog.Close asChild>
            <button className="btn-cancel Button violet">Cancelar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalRegister;
