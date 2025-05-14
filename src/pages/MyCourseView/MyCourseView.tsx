import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {  GET_COURSE_ONE, GET_FILE_ONE, GET_QUIZ } from "@/lib/API";
import { CourseContent } from "@/lib/utils";

export type FormData = {
  message: string;
};

async function POST_MESSAGE(data: string) {
  const response = await fetch("https://chatbot.quote360.ao/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: data }),
  });
  const json = await response.json();
  return json;
}

export default function MyCourseView() {
  const { id, question } = useParams<{ id: string; question: string }>();
  const [update, setUpdate] = useState(false); // Corrigido: setUpdate
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>();

  const [messageList, setMessagesList] = useState<
    { message: string; sender: string }[]
  >([]);
  const divMessage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divMessage.current) {
      divMessage.current.scrollTo({
        top: divMessage.current.scrollHeight,
        behavior: "smooth", // Animação suave
      });
    }
  }, [messageList]);

  const { data, isPending } = useQuery({
    queryKey: ["get-view-course", id],
    queryFn: ()=>GET_COURSE_ONE(id!),
    })

    const { data: getQuiz, isPending: isPedingQuiz } = useQuery({
        queryKey: ["get-quiz-course", id],
        queryFn: ()=>GET_QUIZ(id!),
        })

    useEffect(() => { if(getQuiz)
    console.log("Data ",getQuiz ) }, [ getQuiz]);
const urlCompleta = window.location.href;

    useEffect(() => {
        setMessagesList([])
        console.log("Question ", question)
        if (question)
            window.localStorage.setItem("data-study",JSON.stringify({ question:question??"",linkUrl: urlCompleta, date: new Date().toLocaleDateString()+"|"+ new Date().toLocaleTimeString()}))
       async function firstMessage() {
            setIsLoading(true)
            const message = await POST_MESSAGE(`${question} contexto: ${data?.course?.course_name}`)
            setMessagesList([message])
            console.log(message)
            setIsLoading(false)
       }
    if(data && question)
        firstMessage()
        
    },[id, question, data])
async function handleSubmit(data:FormData) {
    setIsLoading(true)
    setMessagesList((state) => [...state, {message:data.message, sender: "me"}])
    await POST_MESSAGE(data.message)
        .then((response) => {
            setMessagesList((state) => [...state, {message:response.message, sender: response.sender}])
    })
    form.reset()
    setIsLoading(false)
}
const { data:getFiles, isPending: isLoadingFile } = useQuery({
  queryKey: ["get-file", id],
  queryFn: ({queryKey}) => GET_FILE_ONE(queryKey[1]),
});
    return (
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start">
           
            <div className="w-full border shadow-sm rounded-sm md:flex-1 p-4 flex flex-col gap-4 min-h-[calc(100vh-150px)] overflow-y-auto ">
            <h1>{data?.course?.course_name}</h1>
                 <div className="  h-[calc(100vh-200px)] overflow-y-auto" ref={divMessage}>
                        <h1 className="text-lg font-bold">{question?.replace(/-/g, " ")}</h1>
                        <div className="flex flex-col gap-4" >
                            
                            {
                                messageList.map((message, index)=> (
                                    <div key={index} className={`${message.sender === "me" ? "bg-green-900 text-zinc-100" : "bg-zinc-100 text-zinc-800"}   p-2 text-sm leading-loose flex flex-col w-fit rounded-md max-w-[800px]  `}>
                                           {message?.message?.split("\n").map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                    </div>
                                ))
                            }
                            {isLoading && <span className="text-sm font-bold text-zinc-700 flex gap-2 items-center">Espere um pouco <Loader2 className="mr-2 h-4 w-4 animate-spin" /></span>}
                         </div>
                    </div>
                    <div className="h-10 ">
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex">
                            <Input required disabled={isLoading} {...form.register("message")} className="focus-visible:ring-0 rounded-r-none" type="text" placeholder="Pergunte algo" />
                            <Button disabled={isLoading} className="rounded-l-none"><Send/></Button>
                        </form>
                    </div>            
            </div>
           <div className="flex flex-col w-full md:w-96 gap-2">
                <h1 className="font-bold text-lg">Conteúdo</h1>
                <Card>
                    <CardHeader>
                    <Accordion type="single" collapsible className="w-full">
                    {data?.course.contents?.map((content: CourseContent, index: number) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-nowrap text-ellipsis">{content.title}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="flex flex-col gap-0">
                                    {content.contents.map((item, idx) => (
                                        <Link to={`/portal/classroom/${id}/${item.replace(/ /g, "-")}`} key={idx} className="hover:bg-zinc-100 p-2 rounded-sm">
                                            <li>{item}</li>
                                        </Link>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    
                
                    </Accordion>
                 </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                    <Accordion type="single" collapsible className="w-full">
                         <AccordionItem  value={`item-1`}>
                            <AccordionTrigger className="text-nowrap text-ellipsis">Ficheiros</AccordionTrigger>
                            <AccordionContent>
                                <ul className="flex flex-col gap-0">
                                    {getFiles?.data.map((item, idx) => (
                                        <a target="_blank" href={item.url} key={idx} className="hover:bg-zinc-100 p-2 rounded-sm">
                                            <li>{item.name}</li>
                                        </a>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                     
                    
                
                    </Accordion>
                 </CardHeader>
                </Card>
                <div>
                    <h1 className="font-bold text-lg">Testes</h1>
                     <div className="flex flex-col gap-1">
                    
                  {
                    getQuiz?.data?.map((quiz) => 
                        (<Link to={`/portal/quiz/bem-vindo/${quiz.id}/${id}`} className="hover:bg-zinc-100 rounded-sm">
                          <Card>
                                <CardHeader>
                                    <span>{quiz.title}</span>
                                </CardHeader>
                            </Card>
                          </Link>))
                  }
                    </div>
                </div>
          </div>
      </div>
            )}