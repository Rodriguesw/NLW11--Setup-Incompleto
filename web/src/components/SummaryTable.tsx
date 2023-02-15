import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";
import  { useState, useEffect } from 'react';
import dayjs from "dayjs";

const weekDays = [
    'D',
    'S',
    'T',
    'Q',
    'Q',
    'S',
    'S',
]

const sumarryDates = generateDatesFromYearBeginning()

const minimumSumarryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSumarryDatesSize - sumarryDates.length

type Sumarry = {
    id: string;
    date: string;
    amount: number;
    completed: number;
}[]

export function SummaryTable() {
    const [sumarry, setSumarry] = useState<Sumarry>([])

    useEffect(() => {
        api.get('sumarry').then(response => {
        setSumarry(response.data)
        })
    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3 ">
                {weekDays.map((weekDay, i) => {
                    return (
                        <div
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
                        >
                            {weekDay}
                        </div>
                    )
                })}

            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {sumarryDates.map(date => {
                    const dayInSumarry = sumarry.find(day =>{
                        return dayjs(date).isSame(day.date, 'day')
                    })

                    return (
                    <HabitDay 
                    key={date.toString()}
                    date={date}
                    amount={dayInSumarry?.amount} 
                    completed={dayInSumarry?.completed}
                     />
                )
                })}

                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                    return (
                        <div 
                        key={i} 
                        className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"/>
                    )
                })}

            </div>
        </div>
    )
}