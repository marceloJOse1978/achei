import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import "./Calendar.css"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { PencilRuler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GET_LOGIN_LOGS } from '@/lib/API';
import { useUserContext } from '@/hooks/UserContext';

export function CalendarLog() {
    const [openModal, setOpenModal] = useState(false)
    const[dataValues, setDataValues] = useState<Array<{date:string, count: Number}>>([{ date: '2024-11-11', count: 1 }])
    const {user} = useUserContext()
    const {data} = useQuery({
        queryKey: ['calendar-log', user.student_id],
        queryFn: ({queryKey}) => GET_LOGIN_LOGS(queryKey[1]),
    })
    console.log("Data ", data)
    useEffect(() => {
        if (data) {
           console.log("Data ", data)
            setDataValues(data.data.map((item) => {
                return {
                    date: item.date,
                    count: 1
                }
            }))
        }
    }, [data])
    const [value, setValue] = useState('')

    function handleClick(value) {
        if (value) {
            setValue(format(value.date, "PPP", { locale: ptBR }));
            setOpenModal(true);
        }
    }
    return (
        <div className='w-full md:w-3/4'>
    <CalendarHeatmap
    className="text-sm "
    showWeekdayLabels
    classForValue={(value) => {
        if (!value) {
            return "color-empty";
        }
        return `presente`;
    }}
    monthLabels={  ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']}
    weekdayLabels={['Dom', 'Seg', 'Ter', 'Qua', 'Qui',  'Sex', 'Sab']}
    onClick={handleClick}
        startDate={new Date('2024-06-01')}
        titleForValue={(value) => {
            if (!value) {
                return "Sem atividade";
            }
            return `${format(value.date, "PPP", { locale: ptBR })}`;
        }}
        endDate={new Date('2024-12-31')}
        values={dataValues}
         
    />
    <ModalShowDatePresence openModal={openModal} setOpenModal={setOpenModal} value={value}/>
</div>
    )   
}

export function ModalShowDatePresence({openModal, setOpenModal,value}: {value:string, openModal: boolean, setOpenModal: (value:boolean) => void}) {
    return (
        <Dialog  open={openModal} onOpenChange={setOpenModal}>
            <DialogContent>
            <DialogHeader className="flex flex-col items-center justify-center">
                 <h1 className="font-bold text-md text-center">{value}</h1>
            </DialogHeader>
               
                <DialogFooter>
                    <div className="flex gap-2 items-end justify-center w-full">
                        <Button onClick={()=>setOpenModal(false)} variant={"outline"}>Fechar</Button>
                    </div>
                 </DialogFooter>
            </DialogContent>
           
        </Dialog>
    )
}