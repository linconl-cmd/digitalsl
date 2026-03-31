import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { iconMap, iconOptions } from "@/lib/icons";
import { Pencil, Trash2, Plus, LogOut, ArrowLeft, Loader2, Settings, GripVertical } from "lucide-react";
import SettingsForm from "@/components/admin/SettingsForm";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error("Credenciais inválidas");
    setLoginLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
          <div className="text-center mb-6">
            <span className="text-xl font-black gradient-text">DIGITAL</span>
            <span className="text-xl font-light tracking-widest text-muted-foreground ml-1">SOLUTIONS</span>
            <p className="text-sm text-muted-foreground mt-2">Painel Administrativo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { data: products, isLoading } = useProducts(false);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else {
      toast.success("Produto excluído");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleToggleActive = async (product: Product) => {
    const { error } = await supabase.from("products").update({ active: !product.active }).eq("id", product.id);
    if (error) toast.error("Erro ao atualizar status");
    else queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !products) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(products, oldIndex, newIndex);

    // Optimistic update
    queryClient.setQueryData(["products", false], reordered);

    // Persist new order
    const updates = reordered.map((p, i) =>
      supabase.from("products").update({ sort_order: i }).eq("id", p.id)
    );
    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);
    if (hasError) {
      toast.error("Erro ao reordenar");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  if (showSettings) {
    return <SettingsForm onClose={() => setShowSettings(false)} />;
  }

  if (editing || creating) {
    return (
      <ProductForm
        product={editing}
        onClose={() => { setEditing(null); setCreating(false); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div>
              <span className="text-lg font-black gradient-text">DIGITAL</span>
              <span className="text-lg font-light tracking-widest text-muted-foreground ml-1">SOLUTIONS</span>
              <span className="text-sm text-muted-foreground ml-2">| Admin</span>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Produtos</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowSettings(true)} className="gap-2">
              <Settings className="h-4 w-4" /> Configurações
            </Button>
            <Button onClick={() => setCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Produto
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={products?.map((p) => p.id) || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {products?.map((product) => (
                  <SortableProductRow
                    key={product.id}
                    product={product}
                    onEdit={() => setEditing(product)}
                    onDelete={() => handleDelete(product.id)}
                    onToggleActive={() => handleToggleActive(product)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

function SortableProductRow({
  product,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const Icon = iconMap[product.icon] || iconMap.shield;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground touch-none">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="rounded-lg p-2" style={{ background: "var(--gradient-primary)" }}>
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{product.name}</p>
        <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2).replace(".", ",")}</p>
      </div>
      <Switch checked={product.active} onCheckedChange={onToggleActive} />
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    original_price: product?.original_price?.toString() || "",
    price: product?.price?.toString() || "",
    icon: product?.icon || "shield",
    active: product?.active ?? true,
    has_periods: product?.has_periods ?? false,
    price_12m: product?.price_12m?.toString() || "",
    original_price_12m: product?.original_price_12m?.toString() || "",
    price_24m: product?.price_24m?.toString() || "",
    original_price_24m: product?.original_price_24m?.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      name: form.name,
      description: form.description,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      price: parseFloat(form.price),
      icon: form.icon,
      active: form.active,
      has_periods: form.has_periods,
      price_12m: form.price_12m ? parseFloat(form.price_12m) : null,
      original_price_12m: form.original_price_12m ? parseFloat(form.original_price_12m) : null,
      price_24m: form.price_24m ? parseFloat(form.price_24m) : null,
      original_price_24m: form.original_price_24m ? parseFloat(form.original_price_24m) : null,
    };

    const { error } = product
      ? await supabase.from("products").update(data).eq("id", product.id)
      : await supabase.from("products").insert(data);

    if (error) {
      toast.error("Erro ao salvar produto");
    } else {
      toast.success(product ? "Produto atualizado" : "Produto criado");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Button variant="ghost" onClick={onClose} className="mb-6 gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold text-foreground mb-6">{product ? "Editar Produto" : "Novo Produto"}</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Nome</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
          </div>
          <div>
            <Label>Benefícios (separe com |)</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="mt-1" placeholder="Benefício 1|Benefício 2|Benefício 3" />
          </div>
          <div>
            <Label>Preço Original (R$) — riscado</Label>
            <Input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="mt-1" placeholder="Opcional" />
          </div>
          <div>
            <Label>Preço com Desconto (R$)</Label>
            <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="mt-1" />
          </div>
          <div>
            <Label>Ícone</Label>
            <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => {
                  const I = iconMap[icon];
                  return (
                    <SelectItem key={icon} value={icon}>
                      <span className="flex items-center gap-2">
                        <I className="h-4 w-4" /> {icon}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.has_periods} onCheckedChange={(v) => setForm({ ...form, has_periods: v })} />
            <Label>Opções de 12/24 meses</Label>
          </div>
          {form.has_periods && (
            <div className="space-y-4 rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-foreground">Preços por Período</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original 12m (R$)</Label>
                  <Input type="number" step="0.01" value={form.original_price_12m} onChange={(e) => setForm({ ...form, original_price_12m: e.target.value })} className="mt-1" placeholder="Opcional" />
                </div>
                <div>
                  <Label>Desconto 12m (R$)</Label>
                  <Input type="number" step="0.01" value={form.price_12m} onChange={(e) => setForm({ ...form, price_12m: e.target.value })} className="mt-1" required />
                </div>
                <div>
                  <Label>Original 24m (R$)</Label>
                  <Input type="number" step="0.01" value={form.original_price_24m} onChange={(e) => setForm({ ...form, original_price_24m: e.target.value })} className="mt-1" placeholder="Opcional" />
                </div>
                <div>
                  <Label>Desconto 24m (R$)</Label>
                  <Input type="number" step="0.01" value={form.price_24m} onChange={(e) => setForm({ ...form, price_24m: e.target.value })} className="mt-1" required />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            <Label>Produto ativo</Label>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
