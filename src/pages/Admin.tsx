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
import { Pencil, Trash2, Plus, LogOut, ArrowLeft, Loader2, Settings } from "lucide-react";
import SettingsForm from "@/components/admin/SettingsForm";
import { toast } from "sonner";

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
          <div className="space-y-3">
            {products?.map((product) => {
              const Icon = iconMap[product.icon] || iconMap.shield;
              return (
                <div key={product.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="rounded-lg p-2" style={{ background: "var(--gradient-primary)" }}>
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                  </div>
                  <Switch checked={product.active} onCheckedChange={() => handleToggleActive(product)} />
                  <Button variant="ghost" size="icon" onClick={() => setEditing(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
