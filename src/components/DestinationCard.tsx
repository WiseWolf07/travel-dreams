import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Destination } from "@/types/destination"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

type Props = {
  destination: Destination
  onToggleVisited: (id: number) => void
  onDelete: (id: number) => void
}

export function DestinationCard({ destination, onToggleVisited, onDelete }: Props) {
  return (
    <Card className="shadow-md relative">
      <img
        src={destination.image}
        alt={destination.name}
        className="h-48 w-full object-cover rounded-t-md"
      />
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{destination.name}</CardTitle>

        {/* Botón de eliminar arriba a la derecha */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-red-600 hover:bg-red-100"
          onClick={() => onDelete(destination.id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={destination.visited}
            onChange={() => onToggleVisited(destination.id)}
          />
          <span className={destination.visited ? "line-through text-green-600" : ""}>
            {destination.visited ? "Ya fuimos 🥰" : "Por conocer 💫"}
          </span>
        </label>
      </CardContent>
    </Card>
  )
}
