import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePicker from "./DatePickerBirth";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader2 } from "lucide-react";
import userProfile from "../../assets/user-profile.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EDIT_DATA_STUDENT, GET_ME, GET_MY_CLASSES, GET_QUIZ, POST_PASSWORD, SUBMIT_DATA_STUDENT } from "@/lib/API";
import { useUserContext } from "@/hooks/UserContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
const schema = z.object({
  full_name: z.string().min(1, "Nome é obrigatório"),
  phone_number: z.string().min(9, "Telefone deve ter no mínimo 9 dígitos"),
  birth_date: z.string(),
  address: z.string().min(1, "Endereço é obrigatório"),
  id_type: z.enum(["1", "2", "3"], {
    required_error: "Tipo de documento é obrigatório",
  }),
  id_number: z.string().min(1, "Número de identificação é obrigatório"),
  observations: z.string().default(""),
});
export default function ProfilePage() {
  const { user } = useUserContext();

  const { data, isPending } = useQuery({
    queryKey: ["get-me"],
    queryFn: GET_ME
  })
  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      <Card className="w-full md:w-96">
        <CardHeader className="relative h-20">
          <div className="absolute flex items-center justify-center rounded-full h-28 w-28 -bottom-28 left-2/4 -translate-y-2/4 -translate-x-2/4 ">
            <img src={userProfile} alt="" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center pt-16 min-w bg-zinc-100">
          <h1 className="text-lg font-bold text-center">{user?.name}</h1>
          <span className="font-normal text-center text-zinc-600">
            {user?.email}
          </span>
        </CardContent>
      </Card>
      <div className="w-full">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Minha conta</TabsTrigger>
            <TabsTrigger value="access">Acesso</TabsTrigger>
            <TabsTrigger value="grade">Certificados</TabsTrigger>
          </TabsList>
          <TabsContent
            className="w-full p-4 bg-white border rounded-md shadow-sm"
            value="account"
          >
            <MyAccount data={data} />
          </TabsContent>
          <TabsContent
            className="w-full p-4 bg-white border rounded-md shadow-sm"
            value="access"
          >
            <Access data={data} />
          </TabsContent>
          {/*  <TabsContent
            className="w-full p-4 bg-white border rounded-md shadow-sm"
            value="grade"
          >
            <Grade />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}

export function MyAccount({ data }: { data: any }) {
  const [date, setDate] = useState<Date>(new Date("2000-01-01"));
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema, {}),
  });
  useEffect(() => {
    console.log("dados",data?.message)
    if (data && !data.error) {
      const dataAread = window.localStorage.getItem("data-aready");
      if (dataAread)
      window.localStorage.removeItem("data-aready");
      setValue("full_name", data.full_name);
      setValue("phone_number", data.phone_number);
      setValue("birth_date", data.birth_date);
      const birthDate = data?.birth_date;
      const parsedDate = birthDate ? new Date(birthDate) : new Date("2000-01-01");
      setDate(parsedDate);
      setValue("address", data.address);
      setValue("id_type", data.id_type);
      setValue("id_number", data.id_number);
      setValue("observations", data.observations || "");  // Observações, com valor padrão se não definido
    }
  }, [data])

  const { user } = useUserContext();

  const { mutateAsync: submitData, isPending } = useMutation({
    mutationFn: SUBMIT_DATA_STUDENT,
    onSuccess(data) {
      console.log(data);
      if (data.message) {
        toast.error("Erro ao salvar dados");
        return;
      }
      toast.success("Dados salvos com sucesso");
      window.localStorage.removeItem("data-aready");
      window.location.reload();
    },
    onError(error) {
      console.log(error);
      toast.error("Erro ao salvar dados");
    },
  });


  const { mutateAsync: editData, isPending: isPedingEdit } = useMutation({
    mutationFn: EDIT_DATA_STUDENT,
    onSuccess(data) {
      console.log(data);
      if (data.message) {
        toast.error("Erro ao editar dados");
        return;
      }
      toast.success("Dados editados com sucesso");
    },
    onError(error) {
      console.log(error);
      toast.error("Erro ao editar dados");
    },
  });

  const onSubmit = (FormData: any) => {
    if (data.message !== undefined){
      submitData(FormData);
      
    }
    else{
      editData(FormData);
    }
  };
  useEffect(() => {
    const dataBirth = format(date, "yyyy-MM-dd");
    if (!data?.error && date) {
      setValue("birth_date", dataBirth);
    }
  }, [date, data]);
  return (
    <form
      className="flex flex-col w-full gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Dados pessoais</h1>
      <div className="flex flex-col items-center w-full gap-4 md:flex-row md:flex-1">
        <fieldset className="flex flex-col w-full gap-2 md:flex-1 ">
          <Label>Nome</Label>
          <Input

            placeholder="Seu nome"
            type="text"
            {...register("full_name")}
          />
          {errors.name && <span>{String(errors.name.message)}</span>}
        </fieldset>
        <fieldset className="flex flex-col w-full gap-2 md:w-72">
          <Label>Telefone</Label>
          <Input

            placeholder="Seu Telefone"
            type="text"
            {...register("phone_number")}
          />
          {errors.phone && <span>{String(errors.phone.message)}</span>}
        </fieldset>
      </div>
      <fieldset className="flex flex-col w-full gap-2">
        <Label>Data de nascimento</Label>
        <DatePicker selectedDate={date} setSelectedDate={setDate} />
      </fieldset>
      <fieldset className="flex flex-col w-full gap-2">
        <Label>Endereço</Label>
        <Input

          placeholder="Seu Endereço"
          type="text"
          {...register("address")}
        />
        {errors.address && <span>{String(errors.address.message)}</span>}
      </fieldset>
      <fieldset className="flex flex-col w-full gap-2">
        <Label>Email</Label>
        <Input
          placeholder="" value={user?.email} disabled type="email" />
      </fieldset>
      <div className="flex flex-col items-center w-full gap-4 md:flex-row md:flex-1">
        <fieldset className="flex flex-col w-full gap-2 md:flex-1">
          <Label>Selecione tipo de documento</Label>
          <Select
            value={watch("id_type")}
            {...register("id_type")}
            onValueChange={(value) => setValue("id_type", value)}

          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectGroup>
              <SelectContent>
                <SelectLabel>Documentos</SelectLabel>
                <SelectItem value="0">Selecione o tipo</SelectItem>
                <SelectItem value="1">Bilhete de ID</SelectItem>
                <SelectItem value="2">Passaporte</SelectItem>
                <SelectItem value="3">Certidão</SelectItem>

              </SelectContent>
            </SelectGroup>
          </Select>
          {errors.documentType && (
            <span>{String(errors.documentType.message)}</span>
          )}
        </fieldset>
        <fieldset className="flex flex-col w-full gap-2 md:flex-1">
          <Label>Nº de identificação</Label>
          <Input


            placeholder="Número de identificação"
            type="text"
            {...register("id_number")}
          />
          {errors.documentNumber && (
            <span>{String(errors.documentNumber.message)}</span>
          )}
        </fieldset>
      </div>
      <div className="flex items-end justify-end">
        <Button type="submit" className="flex items-center gap-2">
          Salvar {isPending && <Loader2 className="w-4 animate-spin " />}
        </Button>
      </div>
    </form>
  );
}

export function ModalChangePassword() {
  const { user, setUser } = useUserContext()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setconfirmPassword] = useState("")
  const { mutateAsync: updatePasword, isPending } = useMutation({
    mutationFn: POST_PASSWORD,
    onSuccess(data) {
      toast.success("Palavra-passe alterada com sucesso")
      setUser(null)
    },
    onError(error) {
      setUser(null)
      toast.error("Erro ao alterar palavra-passe")
      console.log(error)
    }
  })
  function handleClick() {
    if (newPassword !== confirmPassword) {
      toast.error("As palavras-passe não coincidem")
      return;
    }
    if (oldPassword && newPassword) {
      updatePasword({ currentPassword: oldPassword, newPassword: newPassword })
      return;
    }

    toast.error("Preencha os campos corretamente")
  }
  const [openModal, setOpenModal] = useState(false)
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger>
        <Button className="bg-red-800 rounded-l-none hover:bg-red-900">Mudar senha</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-md text-center">Alterar palavra-passe</h1>
        </DialogHeader>
        <Input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Palavra-passe atual" type="password" />
        <span className="text-xs">Minimo 8 caracteres</span>
        <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova palavra-passe" type="password" />
        <Input value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} placeholder="Repita a palavra-passe" type="password" />
        <DialogFooter>
          <div className="flex gap-2 items-end justify-center w-full">
            <Button onClick={() => setOpenModal(false)} variant={"outline"}>Fechar</Button>
            <Button className="bg-blue-800" disabled={isPending} onClick={handleClick}>Salvar {isPending && <Loader2 className="animate-spin" />}</Button>
          </div>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}


export function Access({ data }: { data: any }) {
  const { user } = useUserContext()
  return (
    <div className="flex flex-col w-full gap-4">
      <h1>Informações de acesso</h1>
      <fieldset>
        <Label>Email</Label>
        <Input
          disabled value={user.email} />
      </fieldset>
      <fieldset>
        <Label>Senha</Label>
        <div className="flex items-center">
          <Input

            className="rounded-r-none"
            value={"************"}
            disabled
            placeholder=""
          />
          <ModalChangePassword />

        </div>
      </fieldset>
    </div>
  );
}

export function Grade() {
  return (
    <div>
      <h1>Certificados</h1>
      <div className="flex flex-col mt-2">
        <div className="flex items-center overflow-hidden border rounded-sm shadow-sm h-14">
          <div className="flex items-center justify-center text-white bg-primary h-14 w-14">
            <GraduationCap />
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="ml-2">Curso de ingles</span>
            <Button className="" variant={"link"}>
              Obter certificado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
