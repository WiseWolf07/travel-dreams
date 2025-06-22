import { useEffect, useState } from "react"
import type { Destination } from "@/types/destination"
import { DestinationCard } from "@/components/DestinationCard"
import { AddDestinationModal } from "@/components/AddDestinationModal"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filter, setFilter] = useState<"all" | "visited" | "notVisited">("all")

  const fetchDestinations = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("created_at", { ascending: false })

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

    if (!error) {
      fetchDestinations()
    }
  }

  const handleAddDestination = async (newDest: Omit<Destination, "id" | "created_at">) => {
    const { error } = await supabase.from("destinations").insert(newDest)
    if (!error) fetchDestinations()
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("destinations").delete().eq("id", id)
    if (!error) fetchDestinations()
  }

  const filteredDestinations = destinations.filter((d) => {
    if (filter === "visited") return d.visited
    if (filter === "notVisited") return !d.visited
    return true
  })

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        ✈️ Nuestros destinos soñados
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 border border-gray-300"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("notVisited")}
          className={`px-4 py-2 rounded-full ${
            filter === "notVisited"
              ? "bg-blue-900 text-white"
              : "bg-white text-gray-800 border border-gray-300"
          }`}
        >
          Por conocer 💫
        </button>
        <button
          onClick={() => setFilter("visited")}
          className={`px-4 py-2 rounded-full ${
            filter === "visited"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-800 border border-gray-300"
          }`}
        >
          Ya fuimos 🥰
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mb-4">
        Mostrando {filteredDestinations.length} destino
        {filteredDestinations.length !== 1 && "s"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
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
