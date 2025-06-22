import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type Props = {
  onAdd: (destination: { name: string; image: string; visited: boolean }) => void
}

export function AddDestinationModal({ onAdd }: Props) {
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [visited, setVisited] = useState(false)

  const handleSubmit = () => {
    if (!name || !image) return

    onAdd({ name, image, visited })
    setName("")
    setImage("")
    setVisited(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 text-2xl shadow-lg">
          +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nuevo destino</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Nombre del lugar</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>URL de imagen</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="visited"
              checked={visited}
              onCheckedChange={(checked) => setVisited(Boolean(checked))}
            />
            <Label htmlFor="visited">¿Ya fuimos?</Label>
          </div>
          <Button onClick={handleSubmit}>Guardar destino</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
