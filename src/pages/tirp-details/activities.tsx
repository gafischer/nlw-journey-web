import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format, toDate, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleCheck, CircleDashed } from "lucide-react";
import React from "react";

interface Activity {
  date: string
  activities: {
    id: string
    title: string
    occursAt: string
  }[]
}

export function Activities() {
  const { tripId } = useParams()
  const [activities, setActivities] = useState<Activity[]>([])
  
  useEffect(() => {
    api.get(`/trips/${tripId}/activities`).then(response => setActivities(response.data))
  }, [tripId])
  
  return (
    <div className="space-y-8">
      {activities.map(category => {
        const curretDate = toDate(category.date)

        const passedDate = isBefore(curretDate, new Date())

        return (
          <React.Fragment>
          <div key={category.date} className="space-y-2.5 relative">
            {passedDate && (
              <div className="bg-zinc-950/60 absolute inset-0 h-full"></div>
            )}
            
            <div className="flex gap-2 items-baseline">
              <span className="text-xl text-zinc-300 font-semibold">Dia {format(category.date, 'd')}</span>
              <span className="text-xs text-zinc-500">{format(category.date, 'EEEE', { locale: ptBR })}</span>
            </div>
            {category.activities.length > 0 ? (
              <React.Fragment>
                {category.activities.map(activity => {
                  return (
                    <div key={activity.id} className="space-y-2.5">
                      <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                        {passedDate ? (
                          <CircleCheck className="size-5 text-lime-300" />
                        ) : (
                          <CircleDashed className="text-zinc-400 size-5"/>
                        )}
                        
                        <span className="text-zinc-100">{activity.title}</span>
                        <span className="text-zinc-400 text-sm ml-auto">
                          {format(activity.occursAt, 'HH:mm')}h
                        </span>
                      </div>
                    </div>
                  )
                })}
              </React.Fragment>
            ) : (
              <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
            )}
          </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}