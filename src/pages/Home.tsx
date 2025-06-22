import { useEffect, useState } from "react"
import type { Destination } from "@/types/destination"
import { DestinationCard } from "@/components/DestinationCard"
import { AddDestinationModal } from "@/components/AddDestinationModal"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([])

  const fetchDestinations = async () => {
    const { data, error } = await supabase.from("destinations").select("*").order("created_at", { ascending: false })
    if (error) console.error("Error fetching:", error)
    else setDestinations(data as Destination[])
  }

  useEffect(() => {
    fetchDestinations()
  }, [])

  useEffect(() => {
    const channel = supabase
        .channel("realtime:destinations")
        .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "destinations" },
        () => {
            fetchDestinations()
        }
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
  }, [])


  const toggleVisited = async (id: number) => {
    const current = destinations.find((d) => d.id === id)
    if (!current) return

    const { error } = await supabase
      .from("destinations")
      .update({ visited: !current.visited })
      .eq("id", id)

    if (!error) fetchDestinations()
  }

  const handleAddDestination = async (newDest: Omit<Destination, "id" | "created_at">) => {
    const { error } = await supabase.from("destinations").insert(newDest)
    if (!error) fetchDestinations()
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("destinations").delete().eq("id", id)
    if (!error) fetchDestinations()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        ✈️ Nuestros destinos soñados
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onToggleVisited={toggleVisited}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AddDestinationModal onAdd={handleAddDestination} />
    </div>
  )
}
